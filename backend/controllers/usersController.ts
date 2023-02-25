import asyncHandler from 'express-async-handler'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import pool from '../config/db'

const asyncPool = pool.promise()

export const getUsers = asyncHandler(async (req, res) => {
	const sql = 'SELECT name, total_score FROM users;'

	const userData = await asyncPool.query(sql)
	res.status(200).json(userData[0])
})

export const addUser = asyncHandler(async (req, res) => {
	const { name, pass } = req.body

	if (!name || !pass) {
		res.status(400)
		throw new Error('Name or password not supplied')
	}

	//	check if user exists
	const userExists = await asyncPool.query(
		`SELECT EXISTS (SELECT name FROM users WHERE name = \'${name}\');`
	)

	//  abort if user exists
	if (Object.values(userExists[0][0])[0] === 1) {
		res.status(400).json({
			error: 'name taken',
		})
		throw new Error('name taken')
	}

	// 	add to db
	const salt = await bcrypt.genSalt()
	const hashedPass = await bcrypt.hash(pass, salt)

	const insertUserData = `INSERT INTO users (name, hashed_pass) VALUES ('${name}', '${hashedPass}');`
	await asyncPool.query(insertUserData)

	//  return new user data
	const select = `SELECT * FROM users WHERE name = '${name}';`
	const newUserData = await asyncPool.query(select)
	const { user_id } = newUserData[0][0]
	const token = generateToken(user_id)

	res.status(200).json({ user_id, name, token })
})

function generateToken(id: string) {
	if (!process.env.JWT_SECRET) {
		throw new Error('Could not access JWT secret')
	}
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: '30d',
	})
}
