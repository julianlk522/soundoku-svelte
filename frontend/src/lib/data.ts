import type { AuthData, FormData } from './types'

const API_URL = 'http://localhost:5000'
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
