import express from 'express'
import { addWin, getWins } from '../controllers/winsController'

const router = express.Router()

router.route('/').get(getWins).post(addWin)

export default router
