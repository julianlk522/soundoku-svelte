//	Frontend:

export const difficulties = [
	'Very Easy',
	'Easy',
	'Medium',
	'Hard',
	'Very Hard',
] as const

export type Difficulty = (typeof difficulties)[number]

//	API requests:

export type User = {
	name: string | undefined
	total_score: number | undefined
	token: string | undefined
}

export type FormData = {
	name: string
	pass: string
}

export type AuthData = {
	name: string
	token: string
}

export type WinData = {
	difficulty: Difficulty
	duration: number
	errors: number
}

export interface UserWinData extends WinData {
	name: string
	token: string
}
