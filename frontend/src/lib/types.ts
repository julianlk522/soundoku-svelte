//	Frontend:

export const difficulties = [
	'Very Easy',
	'Easy',
	'Medium',
	'Hard',
	'Very Hard',
] as const

export type Difficulty = (typeof difficulties)[number]

export type DeviceType = 'mobile' | 'tablet' | 'desktop'

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

export interface Score extends Omit<WinData, 'duration'> {
	name: string
	date: string
	duration: string
	score: number
}
