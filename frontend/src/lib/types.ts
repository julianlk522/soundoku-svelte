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
