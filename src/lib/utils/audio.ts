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
let currentTimeAtLastNote = 0
let waitTime = 0

const minimumTimeDeltaBeforeThrottlingAttack = 0.1
const minAttackTime = 0.01
const maxAttackTime = 0.2
let attackTime = minAttackTime
const decayTime = 0.1
const releaseVolume = 0.25
const releaseTime = 1.5
const noteDuration = attackTime + decayTime + releaseTime

export function playAudio(
	toneIndex: number,
	panning?: number,
	intonation?: undefined | 'staccato'
) {
	if (waitTime && waitTime < minimumTimeDeltaBeforeThrottlingAttack) {
		stopAudio()
	}
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
	gainNode.gain.linearRampToValueAtTime(
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

	// fix this
	oscillator.connect(panner)

	oscillator.start(now)
	oscillator.stop(now + duration)
}

function init() {
	oscillator = audioCtx.createOscillator()
	gainNode = audioCtx.createGain()

	oscillator.connect(gainNode)
	gainNode.connect(audioCtx.destination)

	if (currentTimeAtLastNote) {
		waitTime = audioCtx.currentTime - currentTimeAtLastNote
		getNewAttackTime()
	}

	currentTimeAtLastNote = audioCtx.currentTime
}

function stopAudio() {
	if (!oscillator) return

	if (
		currentTimeAtLastNote &&
		audioCtx.currentTime - currentTimeAtLastNote <
			minimumTimeDeltaBeforeThrottlingAttack
	) {
		gainNode.gain.exponentialRampToValueAtTime(
			0.00001,
			audioCtx.currentTime + minAttackTime
		)
		oscillator.stop(audioCtx.currentTime + minAttackTime)
	}
}

function getNewAttackTime() {
	if (waitTime && waitTime < minimumTimeDeltaBeforeThrottlingAttack) {
		attackTime = Math.min(
			attackTime + 0.5 * (maxAttackTime - attackTime),
			maxAttackTime
		)
	} else {
		attackTime = Math.max(
			attackTime - 0.5 * (attackTime - minAttackTime),
			minAttackTime
		)
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
