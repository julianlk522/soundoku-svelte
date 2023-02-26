import express from 'express'
import { addWin, getWins } from '../controllers/winsController'
import protect from '../middleware/authMiddleware'

const router = express.Router()

router.route('/').get(getWins).post(protect, addWin)

export default router
