import asyncHandler from 'express-async-handler'
import pool from '../config/db'
import { createHmac } from 'crypto'

const asyncPool = pool.promise()

export const getWins = asyncHandler(async (req, res) => {
	const sql = 'SELECT * FROM wins;'

	const winData = await asyncPool.query(sql)
	res.status(200).json(winData[0])
})

export const addWin = asyncHandler(async (req, res) => {
	const { name, difficulty, duration, errors, hash: clientHash } = req.body

	if (!name || !difficulty || !duration || !errors || !clientHash) {
		res.status(400)
		throw new Error('Not all fields provided')
	}

	if (!process.env.WIN_SECRET) {
		throw new Error('Could not access hash secret')
	}

	const unserializedWin = { name, difficulty, duration, errors }

	const serverHash = createHmac('sha256', process.env.WIN_SECRET)
		.update(JSON.stringify(unserializedWin))
		.digest('base64')

	if (serverHash !== clientHash) {
		res.status(401)
		throw new Error('Failed hash check')
	}

	//	todo: calculate score based on duration and errors
	let score = 1

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
