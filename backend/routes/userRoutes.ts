import express from 'express'
import {
	addUser,
	getUsers,
	getUserScore,
	loginUser,
} from '../controllers/usersController'
import protect from '../middleware/authMiddleware'

const router = express.Router()

router.route('/').get(getUsers).post(addUser)
router.route('/login').post(loginUser)
router.route('/:name').get(protect, getUserScore)

export default router
