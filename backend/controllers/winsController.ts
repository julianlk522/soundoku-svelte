import asyncHandler from 'express-async-handler'
import pool from '../config/db'
import { createHmac } from 'crypto'
import { getWinScore } from './util/getWinScore'
import { difficultyLevels } from './types'

const asyncPool = pool.promise()

export const getWinsPages = asyncHandler(async (req, res) => {
	const numPagesSql = `SELECT CEIL(COUNT(*) / 10) AS pages FROM wins;`

	const rawPagesData = await asyncPool.query(numPagesSql)
	const pagesData = rawPagesData[0][0]
	const { pages } = pagesData

	if (!pagesData || !pages) {
		res.status(500)
		throw new Error('Messed up while querying for total pages')
	}

	res.status(200).json(pagesData.pages)
})

export const getWins = asyncHandler(async (req, res) => {
	const { page } = req.query
	const start = page ? (+page - 1) * 10 : 0

	const sql = `SET @row_num = 0; SELECT *FROM (SELECT q2.row_count + 1 - @row_num := @row_num + 1 AS row_num, name, date, difficulty, duration,errors, score FROM (SELECT row_count, name, date, difficulty, duration, errors, score FROM wins JOIN (SELECT COUNT(*) AS row_count FROM wins) q1) q2 ORDER BY score ASC, errors DESC, difficulty DESC, duration DESC) q3 ORDER BY row_num ASC LIMIT ${
		start ? start + ', ' : ''
	}10;`

	const rawWinData = await asyncPool.query(sql)
	const winData = rawWinData[0][1]
	if (!winData.length) {
		res.status(404)
		throw new Error('Exceeded database boundary')
	}
	res.status(200).json({ scores: winData })
})

export const addWin = asyncHandler(async (req, res) => {
	const { name, difficulty, duration, errors, hash: clientHash } = req.body

	if (
		!name ||
		!difficulty ||
		!duration ||
		errors === undefined ||
		!clientHash
	) {
		res.status(400)
		throw new Error('Not all fields provided')
	}

	if (!difficultyLevels.includes(difficulty)) {
		res.status(400)
		throw new Error('Invalid difficulty level supplied')
	}

	if (!process.env.WIN_SECRET) {
		throw new Error('Could not access hash secret')
	}

	const unserializedWin = { name, difficulty, duration, errors }
	const serializedWin = JSON.stringify(unserializedWin)

	const serverHash = createHmac('sha256', process.env.WIN_SECRET)
		.update(serializedWin)
		.digest('base64')

	if (serverHash !== clientHash) {
		res.status(401)
		throw new Error('Failed hash check')
	}

	const score = getWinScore(difficulty, duration, errors)

	const insertWinData = `INSERT INTO wins (name, difficulty, duration, errors, score) VALUES ('${name}', '${difficulty}', '${duration}', '${errors}', '${score}');`

	const updateTotalScore = `UPDATE users SET total_score = total_score + ${score} WHERE name = '${name}'`

	try {
		await asyncPool.query(insertWinData)
		await asyncPool.query(updateTotalScore)
	} catch {
		res.status(400)
		throw new Error(
			'Could not insert data. Supplied name probably is not a real user'
		)
	}

	res.status(201).json({ name, difficulty, duration, errors, score })
})
