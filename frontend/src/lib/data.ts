import CryptoJS from 'crypto-js'
import type { AuthData, FormData, UserWinData } from './types'

const API_URL = 'https://soundoku-server.onrender.com'
const jsonHeaders = {
	'Content-Type': 'application/json',
}

export const getUsers = async () => {
	const response = await fetch(`${API_URL}/users`)
	const data = await response.json()
	return data
}

export const createUser = async (userInfo: FormData) => {
	const response = await fetch(`${API_URL}/users`, {
		method: 'POST',
		headers: jsonHeaders,
		body: JSON.stringify(userInfo),
	})
	const data = await response.json()
	return data
}

export const loginUser = async (userInfo: FormData) => {
	const response = await fetch(`${API_URL}/users/login`, {
		method: 'POST',
		headers: jsonHeaders,
		body: JSON.stringify(userInfo),
	})
	const data = await response.json()
	return data
}

export const getUserScore = async (userInfo: AuthData) => {
	const response = await fetch(`${API_URL}/users/${userInfo.name}`, {
		headers: { Authorization: `Bearer ${userInfo.token}` },
	})
	const data = await response.json()
	return data
}

export const getWins = async (page: number) => {
	const pageQueryStringURLChunk = page ? `?page=${page}` : ''
	const response = await fetch(`${API_URL}/wins${pageQueryStringURLChunk}`)
	const data = await response.json()
	return data
}

export const getWinsPages = async () => {
	const response = await fetch(`${API_URL}/wins/pages`)
	const data = await response.json()
	return data
}

export const getWinsByUser = async () => {
	const response = await fetch(`${API_URL}/users/wins`)
	const data = await response.json()
	return data
}

export const submitWin = async (win: UserWinData) => {
	const { name, token, difficulty, duration, errors } = win
	const lowerCaseDifficulty = difficulty.toLowerCase()
	const unserializedWin = {
		name,
		difficulty: lowerCaseDifficulty,
		duration,
		errors,
	}
	const serializedWin = JSON.stringify(unserializedWin)

	//	todo: replace with secure string and store somewhere more private
	const secret = 'bibimbap'
	const hash = CryptoJS.HmacSHA256(serializedWin, secret).toString(
		CryptoJS.enc.Base64
	)

	const response = await fetch(`${API_URL}/wins`, {
		headers: { ...jsonHeaders, Authorization: `Bearer ${token}` },
		method: 'POST',
		body: JSON.stringify({
			difficulty: lowerCaseDifficulty,
			duration: win.duration,
			errors: win.errors,
			name,
			hash,
		}),
	})
	const data = await response.json()
	return data
}
