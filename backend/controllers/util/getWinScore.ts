import { difficultyLevels, DifficultyLevel } from '../types'

export function getWinScore(
	difficulty: DifficultyLevel,
	duration: number,
	errors: number
) {
	const difficultyBonus = Math.max(
		0,
		difficultyLevels.indexOf(difficulty) - 2
	)
	const max = 1000 + 250 * difficultyBonus
	const min = 100 * (difficultyLevels.indexOf(difficulty) + 1)
	const potentialLostScore = max - min

	//  cap error-based deductions at 30 errors
	const maxErrors = 30

	//  lose up to 75% of potentialLostScore from errors
	const maxErrorPointDeductions = 0.75 * potentialLostScore
	const errorDeductions =
		Math.min(maxErrors, errors) * (maxErrorPointDeductions / maxErrors)

	//  suppress duration-based deductions for first few minutes, depending on difficulty
	const penaltyFreeDuration = 120 * (difficultyLevels.indexOf(difficulty) + 1)

	if (duration > penaltyFreeDuration) {
		//  cap duration-based deductions at 45min (2700 seconds)
		const maxDuration = 2700

		//  lose up to 25% of potentialLostScore from time expenditure
		const maxDurationPointDeductions = 0.25 * potentialLostScore

		const durationDeductions =
			Math.max(
				0,
				Math.min(
					maxDuration - penaltyFreeDuration,
					duration - penaltyFreeDuration
				)
			) *
			(maxDurationPointDeductions / (maxDuration - penaltyFreeDuration))

		return Math.round(max - errorDeductions - durationDeductions)
	}
	return Math.round(max - errorDeductions)
}
