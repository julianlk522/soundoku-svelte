import type { SignUpData } from './types'

const API_URL = 'http://localhost:5000'
const jsonHeaders = {
	'Content-Type': 'application/json',
}

export const getUsers = async () => {
	const response = await fetch(`${API_URL}/users`)
	const data = await response.json()
	return data
}

export const createUser = async (userInfo: SignUpData) => {
	const response = await fetch(`${API_URL}/users`, {
		method: 'POST',
		headers: jsonHeaders,
		body: JSON.stringify(userInfo),
	})
	const data = await response.json()
	return data
}
