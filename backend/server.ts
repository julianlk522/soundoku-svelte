import express from 'express'
import { errorHandler } from './middleware/errorMiddleware'
import cors from 'cors'
import pool from './config/db'

const app = express()

const PORT = process.env.PORT || 5000

//	connect to MySQL db
pool.query('SELECT * FROM users LIMIT 1;', (err: any) => {
	if (err) throw err
	console.log('Queries are working!')
})

//  general middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

//  routes
import userRoutes from './routes/userRoutes'
app.use('/users', userRoutes)

import winRoutes from './routes/winRoutes'
app.use('/wins', winRoutes)

//	error handling
app.use(errorHandler)

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
