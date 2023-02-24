import * as dotenv from 'dotenv'
dotenv.config({ path: '../.env' })

export const host = process.env.mySql_HOST
export const user = process.env.mySql_USER
export const password = process.env.mySql_PASSWORD
export const database = process.env.mySql_DATABASE
export const port =
	process.env.mySql_PORT && typeof process.env.mySql_PORT === 'string'
		? parseInt(process.env.mySql_PORT)
		: 3306
