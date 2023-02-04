export const notes = [
	{
		name: 'C',
		frequency: 261.63,
	},
	{
		name: 'C#',
		frequency: 277.18,
	},
	{
		name: 'D',
		frequency: 293.66,
	},
	{
		name: 'Eb',
		frequency: 311.13,
	},
	{
		name: 'E',
		frequency: 329.63,
	},
	{
		name: 'F',
		frequency: 349.23,
	},
	{
		name: 'F#',
		frequency: 369.99,
	},
	{
		name: 'G',
		frequency: 392,
	},
	{
		name: 'Ab',
		frequency: 415.3,
	},
]

let audioCtx: AudioContext

const attackTime = 0.25
const decayTime = 0.25
const sustainLevel = 0.01
const releaseTime = 0.25

export function playAudio(
	toneIndex: number,
	panning?: number,
	intonation?: undefined | 'staccato'
) {
	audioCtx = new AudioContext()

	const oscillator = audioCtx.createOscillator()
	oscillator.type = 'sine'

	const gainNode = audioCtx.createGain()

	const now = audioCtx.currentTime
	const duration = intonation === 'staccato' ? 0.5 : 1

	gainNode.gain.setValueAtTime(0, 0)
	gainNode.gain.linearRampToValueAtTime(
		intonation === 'staccato' ? 0.75 : 0.5,
		now + (intonation === 'staccato' ? attackTime / 2 : attackTime)
	)
	gainNode.gain.linearRampToValueAtTime(
		sustainLevel,
		now +
			(intonation === 'staccato' ? attackTime / 2 : attackTime) +
			(intonation === 'staccato' ? decayTime / 2 : decayTime)
	)
	gainNode.gain.setValueAtTime(
		sustainLevel,
		now +
			duration -
			(intonation === 'staccato' ? releaseTime / 2 : releaseTime)
	)
	gainNode.gain.linearRampToValueAtTime(0, now + duration)

	const panner = new StereoPannerNode(audioCtx, {
		pan: panning ? panning : undefined,
	})

	oscillator.connect(gainNode).connect(panner).connect(audioCtx.destination)

	oscillator.frequency.value = notes[toneIndex].frequency
	oscillator.start(now)
	oscillator.stop(now + duration)
}

export function stopAudio() {
	if (audioCtx?.state === 'running') {
		audioCtx.close()
	}
}

export function playArpeggio() {
	const arpeggioNotes = [1, 3, 5, 8]

	let curr = 0
	let ascending = true

	const arpeggioInterval = setInterval(() => {
		playAudio(arpeggioNotes[curr] - 1, undefined, 'staccato')

		if (ascending) {
			if (curr < arpeggioNotes.length - 1) {
				curr++
			} else if (curr === arpeggioNotes.length - 1) {
				ascending = false
				curr--
			}
		} else if (curr > 0) {
			curr--
		} else {
			clearInterval(arpeggioInterval)
		}
	}, 200)
}
