import { test, expect } from 'vitest'
import { topLeftToBottomRightStagger } from '../topLeftToBottomRightStagger'

const output = Array.from(Array(81)).map((_, i) =>
	topLeftToBottomRightStagger(i, 9)
)

test('should return a number', () => {
	for (let i = 0; i < output.length; i++) {
		expect(output[i]).toBeTypeOf('number')
	}
})

test('should always return a number greater than members of an equal column and a lesser or equal row', () => {
	const lowestPossibleIndex = 40
	const i = Math.floor(
		lowestPossibleIndex + Math.random() * (81 - lowestPossibleIndex)
	) //  40-81

	let c = i % 9 //  2
	//  skip testing f(i) < f(i), all other lower indexes will produce lesser output
	c--
	let r = Math.floor(i / 9) //  3

	while (c || r) {
		expect(output[9 * r + c]).toBeLessThan(output[i])
		if (!c) {
			c = i % 9
			r--
			continue
		}
		c--
	}
})
