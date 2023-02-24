import { Request, Response, ErrorRequestHandler, NextFunction } from 'express'

export const errorHandler: ErrorRequestHandler = (
	err: Error,
	_: Request,
	res: Response,
	//	need next arg to prevent "res.status is not a function" errors even while it is not being used
	next: NextFunction
) => {
	const statusCode = res.statusCode ? res.statusCode : 500
	res.status(statusCode)
	res.json({
		message: err.message,
		stack: process.env.NODE_ENV === 'production' ? null : err.stack,
	})
}
