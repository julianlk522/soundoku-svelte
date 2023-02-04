const notes = [
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

let audioCtx = new AudioContext()
let oscillator: OscillatorNode
let gainNode: GainNode
let currentTimeAtLastNote: number

const attackTime = 0.1
const decayTime = 0.05
const releaseVolume = 0.15
const releaseTime = 0.5
const noteDuration = attackTime + decayTime + releaseTime

function init() {
	oscillator = audioCtx.createOscillator()
	gainNode = audioCtx.createGain()

	oscillator.connect(gainNode)
	gainNode.connect(audioCtx.destination)
}

export function playAudio(
	toneIndex: number,
	panning?: number,
	intonation?: undefined | 'staccato'
) {
	init()
	const now = audioCtx.currentTime
	const duration = intonation === 'staccato' ? noteDuration / 2 : noteDuration
	const peakVolume = intonation === 'staccato' ? 0.75 : 0.5

	oscillator.frequency.value = notes[toneIndex].frequency

	//	silence tone immediately then fade in to prevent jumbled tones when rapidly playing notes
	gainNode.gain.exponentialRampToValueAtTime(0.00001, now)

	//	ramp to peakVolume over attackTime
	gainNode.gain.exponentialRampToValueAtTime(
		peakVolume,
		now + (intonation === 'staccato' ? attackTime / 2 : attackTime)
	)
	//	drop to releaseVolume over decayTime
	gainNode.gain.exponentialRampToValueAtTime(
		releaseVolume,
		now +
			(intonation === 'staccato'
				? (attackTime + decayTime) / 2
				: attackTime + decayTime)
	)
	//	fade out over releaseTime
	gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration)

	const panner = new StereoPannerNode(audioCtx, {
		pan: panning ? panning : undefined,
	})

	oscillator.connect(gainNode).connect(panner).connect(audioCtx.destination)

	oscillator.start(now)
	oscillator.stop(now + duration)
}

export function stopAudio() {
	if (!oscillator) return
	//	prevent flickering from stops when playAudio is called rapidly
	if (
		currentTimeAtLastNote &&
		audioCtx.currentTime - currentTimeAtLastNote < attackTime
	) {
		oscillator.stop(audioCtx.currentTime + 0.01)
	}
	currentTimeAtLastNote = audioCtx.currentTime
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
