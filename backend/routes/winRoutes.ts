import express from 'express'
import { addWin, getWins, getWinsPages } from '../controllers/winsController'
import protect from '../middleware/authMiddleware'

const router = express.Router()

router.route('/').get(getWins).post(protect, addWin)
router.route('/pages').get(getWinsPages)

export default router
