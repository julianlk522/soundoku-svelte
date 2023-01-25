export function topLeftToBottomRightStagger(index: number, sideLength: number) {
	if (index >= Math.pow(sideLength, 2)) return

	const hashMap = new Map([
		[0, 0],
		[1, 2],
	])

	if (index === 0 || index === 1) {
		return hashMap.get(index)
	} else if (index < sideLength) {
		return index + 1 + topLeftToBottomRightStagger(index - 1, sideLength)
	} else if (Math.floor(index / sideLength) + (index % sideLength) <= 8) {
		return (
			Math.floor(index / 9) +
			(index % sideLength) +
			topLeftToBottomRightStagger(index - sideLength, sideLength)
		)
	} else {
		return (
			sideLength -
			Math.floor(index / 9) +
			(sideLength - (index % 9)) -
			1 +
			topLeftToBottomRightStagger(index - sideLength, sideLength)
		)
	}
}
