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
let lastToneIndex: number | undefined = undefined
let waitTime = 0

const minimumTimeDeltaBeforeThrottlingAttack = 0.15
const minAttackTime = 0.01
const maxAttackTime = 0.2
const attackTimeRateOfChange = 0.5
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
	//	let notes play their full duration by default, only cancel them prematurely if they are played rapidly
	if (waitTime && waitTime < minimumTimeDeltaBeforeThrottlingAttack) {
		stopAudio()
	}
	//	skip getNewAttackTime() if same note being played successively... causes some flickering from rapid/start stop but better than hearing nothing when clicking a cell quickly I think
	const needNewAttackTime = toneIndex !== lastToneIndex
	init(panning, needNewAttackTime)
	oscillator.frequency.value = notes[toneIndex].frequency

	const now = audioCtx.currentTime
	const duration = intonation === 'staccato' ? noteDuration / 2 : noteDuration
	const peakVolume = intonation === 'staccato' ? 0.75 : 0.5

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

	oscillator.start(now)
	oscillator.stop(now + duration)

	currentTimeAtLastNote = audioCtx.currentTime
	lastToneIndex = toneIndex
}

function init(panning?: number, needNewAttackTime?: boolean) {
	oscillator = audioCtx.createOscillator()
	gainNode = audioCtx.createGain()

	//	set panning if needed, otherwise connect oscillator directly to gainNode
	if (panning) {
		const panner = new StereoPannerNode(audioCtx, {
			pan: panning,
		})
		oscillator.connect(panner)
		panner.connect(gainNode)
	} else {
		oscillator.connect(gainNode)
	}
	gainNode.connect(audioCtx.destination)

	//	analyze waitTime, set next attackTime accordingly
	if (currentTimeAtLastNote) {
		waitTime = audioCtx.currentTime - currentTimeAtLastNote
		if (needNewAttackTime) getNewAttackTime()
	}
}

function stopAudio() {
	if (!oscillator) return

	gainNode.gain.exponentialRampToValueAtTime(
		0.00001,
		audioCtx.currentTime + minAttackTime
	)
	oscillator.stop(audioCtx.currentTime + minAttackTime)
}

function getNewAttackTime() {
	if (waitTime < minimumTimeDeltaBeforeThrottlingAttack) {
		attackTime = Math.min(
			attackTime + attackTimeRateOfChange * (maxAttackTime - attackTime),
			maxAttackTime
		)
	} else {
		attackTime = Math.max(
			attackTime - attackTimeRateOfChange * (attackTime - minAttackTime),
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
