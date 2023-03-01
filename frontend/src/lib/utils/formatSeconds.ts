export function formatSeconds(totalSeconds: number) {
	const minutes = Math.floor(totalSeconds / 60)
	const remainder = totalSeconds % 60
	const seconds = remainder < 10 ? '0' + remainder : remainder

	return `${minutes}: ${seconds}`
}
