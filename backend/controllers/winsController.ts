import asyncHandler from 'express-async-handler'
import { PrismaClient } from '@prisma/client'
import { createHmac } from 'crypto'
import { getWinScore } from './util/getWinScore'
import { difficultyLevels } from './types'

const prisma = new PrismaClient()

export const getWinsPages = asyncHandler(async (req, res) => {
	const wins = await prisma.win.count()
	const pages = Math.ceil(wins / 10)
	res.status(200).json(pages)
})

export const getWins = asyncHandler(async (req, res) => {
	const { page } = req.query
	const skip = page ? (+page - 1) * 10 : 0

	const wins = await prisma.win.findMany({
		skip,
		take: 10,
		orderBy: {
			score: 'desc',
		},
		select: {
			name: true,
			date: true,
			difficulty: true,
			duration: true,
			errors: true,
			score: true,
		},
	})
	const winsWithIndexes = wins.map((win, index) => {
		return { row_num: index + skip + 1, ...win }
	})
	res.status(200).json(winsWithIndexes)
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

	//	check for valid difficulty level
	if (!difficultyLevels.includes(difficulty)) {
		res.status(400)
		throw new Error('Invalid difficulty level supplied')
	}

	//	check hash against win secret
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

	//	get score
	const score = getWinScore(difficulty, duration, errors)

	//	add win to db
	try {
		await prisma.win.create({
			data: {
				name,
				difficulty: difficulty.split(' ').join('_'),
				duration: +duration,
				errors: +errors,
				score: +score,
			},
		})

		await prisma.user.update({
			where: {
				name,
			},
			data: {
				total_score: {
					increment: score,
				},
			},
		})
	} catch (error) {
		res.status(500).json({
			error: 'Something went wrong while logging your win. Sorry about that',
		})
	}

	//	return new win data
	res.status(201).json({ name, difficulty, duration, errors, score })
})
