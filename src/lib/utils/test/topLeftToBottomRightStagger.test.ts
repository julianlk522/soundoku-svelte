import { test, expect } from 'vitest'
import { topLeftToBottomRightStagger } from '../topLeftToBottomRightStagger'

//	# rows and columns
const sideLength = 9

//	calculated indexes for 9x9 grid
const output = Array.from(Array(81)).map((_, i) =>
	topLeftToBottomRightStagger(i, sideLength)
)

test('should return a number', () => {
	for (let i = 0; i < output.length; i++) {
		expect(output[i]).toBeTypeOf('number')
	}
})

test('should always return a number greater than members of a lesser or equal column and a lesser or equal row (except at an equal column and equal row)', () => {
	//	generate random column and row over (sideLength / 2) for sufficient coverage
	let c = Math.floor(
		Math.floor(sideLength / 2) + Math.random() * Math.ceil(sideLength / 2)
	) // 4-8 for sideLength 9
	let r = Math.floor(
		Math.floor(sideLength / 2) + Math.random() * Math.ceil(sideLength / 2)
	) // 4-8 for sideLength 9
	const i = sideLength * r + c

	//  skip testing f(i) < f(i), so decrement c once
	c--

	//	flow of test indexes, assuming i = 40:

	//	(40) -> 39 -> 38 -> 37 -> 36
	//	31 -> 30 -> 29 -> 28 -> 27
	//	22 -> 21 -> 20 -> 19 -> 18
	//	13 -> 12 -> 11 -> 10 -> 9
	//	4 -> 3 -> 2 -> 1 -> 0

	while (c || r) {
		expect(output[sideLength * r + c]).toBeLessThan(output[i])
		if (!c) {
			r--
			c = i % sideLength
			continue
		}
		c--
	}
})

test('should always return a number greater than members of a lesser column and greater row ', () => {
	//	middle index in 9x9 grid
	const i = 40
	let c = i % sideLength
	let r = Math.floor(i / sideLength)
	//  skip testing f(i) < f(i), so decrement c once
	c--

	//	flow of test indexes:

	//	(40) -> 39 -> 38 -> 37 -> 36
	//	48 -> 47 -> 46 -> 45
	//	56 -> 55 -> 54
	//	64 -> 63
	//	72

	while (r < sideLength) {
		expect(output[sideLength * r + c]).toBeLessThan(output[i])
		if (!c) {
			r++
			c = (i % sideLength) - (r - Math.floor(i / sideLength))
			continue
		}
		c--
	}
})
