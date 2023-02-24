import asyncHandler from 'express-async-handler'
import bcrypt from 'bcryptjs'
import pool from '../config/db'

const asyncPool = pool.promise()

export const getUsers = asyncHandler(async (req, res) => {
	const sql = 'SELECT name, total_score FROM users;'

	const userData = await asyncPool.query(sql)
	res.status(200).json(userData[0])
})
