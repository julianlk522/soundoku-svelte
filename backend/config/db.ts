import mysql from 'mysql2'
import { host, user, password, database, port } from './config'

//  mySQL connection
const pool = mysql.createPool({
	host,
	user,
	password,
	database,
	port,
	multipleStatements: true,
})

export default pool
