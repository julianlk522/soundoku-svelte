import { Request } from 'express'
import asyncHandler from 'express-async-handler'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface reqWithUserId extends Request {
	user_id?: string
}

interface jwtPayloadWithId extends JwtPayload {
	id: string
}

const protect = asyncHandler(async (req: reqWithUserId, res, next) => {
	let token: string

	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith('Bearer')
	) {
		if (!process.env.JWT_SECRET) {
			throw new Error('Could not access JWT secret')
		}

		try {
			token = req.headers.authorization.split(' ')[1]

			if (!token) {
				res.status(401)
				throw new Error(
					'Bearer token could not be identified: not authorized'
				)
			}

			const decoded = jwt.verify(
				token,
				process.env.JWT_SECRET
			) as jwtPayloadWithId

			//	check if user exists
			const user = await prisma.user.findFirst({
				where: { user_id: +decoded.id },
			})
			if (!user) {
				res.status(401)
				throw new Error(
					'Could not find user with given bearer token: not authorized'
				)
			}

			req.user_id = decoded.id

			return next()
		} catch (error) {
			console.log(error)
			res.status(401)
			throw new Error('Invalid bearer token: not authorized')
		}
	}
	res.status(401)
	throw new Error('No bearer token provided: not authorized')
})

export default protect
