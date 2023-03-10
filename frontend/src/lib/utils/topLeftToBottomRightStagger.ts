export function topLeftToBottomRightStagger(
	index: number,
	sideLength: number
): number {
	if (index === 0) return 0
	else if (index === 1) return 2
	else if (index < sideLength) {
		return index + 1 + topLeftToBottomRightStagger(index - 1, sideLength)
	} else if (
		Math.floor(index / sideLength) + (index % sideLength) <=
		sideLength - 1
	) {
		return (
			Math.floor(index / sideLength) +
			(index % sideLength) +
			topLeftToBottomRightStagger(index - sideLength, sideLength)
		)
	} else {
		return (
			sideLength -
			Math.floor(index / sideLength) +
			(sideLength - (index % sideLength)) -
			1 +
			topLeftToBottomRightStagger(index - sideLength, sideLength)
		)
	}
}
