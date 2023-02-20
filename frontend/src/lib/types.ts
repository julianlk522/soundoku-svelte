export const difficulties = [
	'Very Easy',
	'Easy',
	'Medium',
	'Hard',
	'Very Hard',
] as const

export type Difficulty = (typeof difficulties)[number]
