import express from 'express'
import { addUser, getUsers, loginUser } from '../controllers/usersController'

const router = express.Router()

router.route('/').get(getUsers).post(addUser)
router.route('/login').post(loginUser)

export default router
