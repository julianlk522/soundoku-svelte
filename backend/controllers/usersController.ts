import asyncHandler from 'express-async-handler'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const getUsers = asyncHandler(async (req, res) => {
	const userData = await prisma.user.findMany()
	res.status(200).json(userData)
})

export const addUser = asyncHandler(async (req, res) => {
	const { name, pass } = req.body
	if (!name || !pass) {
		res.status(400)
		throw new Error('Name or password not supplied')
	}

	//	check if user exists
	const userExists = await prisma.user.count({
		where: { name },
	})
	if (userExists) {
		res.status(400)
		throw new Error('Name taken')
	}

	// 	add to db
	const salt = await bcrypt.genSalt()
	const hashedPass = await bcrypt.hash(pass, salt)
	const newUserData = await prisma.user.create({
		data: {
			name,
			hashed_pass: hashedPass,
		},
	})

	//	generate bearer token
	const token = generateToken(newUserData.user_id.toString())

	//  return new user data
	res.status(200).json({
		name: newUserData.name,
		total_score: newUserData.total_score,
		token,
	})
})

export const loginUser = asyncHandler(async (req, res) => {
	const { name, pass } = req.body
	if (!name || !pass) {
		res.status(400)
		throw new Error('Name or password not supplied')
	}

	//	check if user exists
	const user = await prisma.user.findFirst({
		where: { name },
	})
	if (!user) {
		res.status(400)
		throw new Error('User does not exist')
	}

	//	check if pass matches
	const passMatches = await bcrypt.compare(pass, user.hashed_pass)
	if (!passMatches) {
		res.status(401)
		throw new Error('Incorrect password: not authorized')
	}

	//	generate bearer token
	const token = generateToken(user.user_id.toString())

	//  return user data
	res.status(200).json({
		name: user.name,
		total_score: user.total_score,
		token,
	})
})

export const getUserScore = asyncHandler(async (req, res) => {
	const { name } = req.params
	if (!name) {
		res.status(400)
		throw new Error('Name not supplied')
	}

	//	check if user exists
	const user = await prisma.user.findFirst({
		where: { name },
	})
	if (!user) {
		res.status(400)
		throw new Error('User does not exist')
	}

	//  return user data
	res.status(200).json(user.total_score)
})

export const getWinsByUser = asyncHandler(async (req, res) => {
	const winsByUser = await prisma.win.groupBy({
		by: ['name'],
		_sum: {
			score: true,
		},
		_count: {
			_all: true,
		},
		orderBy: {
			_sum: {
				score: 'desc',
			},
		},
	})

	const winsByUserWithIndexes = winsByUser.map((user, index) => {
		return {
			row_num: index + 1,
			name: user.name,
			total_score: user._sum.score,
			games_played: user._count._all,
		}
	})
	res.status(200).json(winsByUserWithIndexes)
})

function generateToken(id: string) {
	if (!process.env.JWT_SECRET) {
		throw new Error('Could not access JWT secret')
	}
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: '30d',
	})
}
