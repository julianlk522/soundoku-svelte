import { test, expect } from 'vitest'
import { topLeftToBottomRightStagger } from '../topLeftToBottomRightStagger'

test('should return a number', () => {
	for (let i = 0; i < 81; i++) {
		expect(topLeftToBottomRightStagger(i, 9)).toBeTypeOf('number')
	}
})
