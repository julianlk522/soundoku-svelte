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

export type SignUpData = {
	name: string
	pass: string
}
