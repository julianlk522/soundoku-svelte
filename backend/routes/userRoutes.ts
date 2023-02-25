import express from 'express'
import { addUser, getUsers } from '../controllers/usersController'

const router = express.Router()

router.route('/').get(getUsers).post(addUser)

export default router
