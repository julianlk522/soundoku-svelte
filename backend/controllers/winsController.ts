import asyncHandler from 'express-async-handler'
import pool from '../config/db'
import { createHmac } from 'crypto'
import { getWinScore } from './util/getWinScore'
import { difficultyLevels } from './types'

const asyncPool = pool.promise()

export const getWins = asyncHandler(async (req, res) => {
	const { start } = req.query

	const sql = `SELECT name, date, difficulty, duration, errors, score FROM wins ORDER BY score DESC, errors ASC, duration ASC LIMIT ${
		start ? start + ', ' : ''
	}10;`

	const winData = await asyncPool.query(sql)
	if (!winData[0].length) {
		res.status(404)
		throw new Error('Exceeded database boundary')
	}
	res.status(200).json(winData[0])
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
