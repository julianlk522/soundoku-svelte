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
let waitTime: number | undefined = undefined

const minimumWaitTimeToThrottleAttack = 0.1
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
	triggeredByNavigation: boolean = false,
	panning?: number
) {
	waitTime = audioCtx.currentTime - currentTimeAtLastNote

	//	let notes play their full duration by default, only cancel them prematurely if they are played rapidly

	//	prevents cacophony from holding down one of the navigation buttons and triggering new notes at max speed
	const spammingNotes = waitTime <= minimumWaitTimeToThrottleAttack

	//	Todo: improve solution to prevent blips from rapidly navigating over some empty/some filled cells (2-3 in a row causes enough waitTime to exceed minimumWaitTimeToThrottleAttack)

	//	abort early if spamming notes via number keys: no reason to hear same tone more than once
	//	when calling via navigation keys it may be nice to hear the last note that was triggered
	if (spammingNotes) {
		getNewAttackTime()
		if (!triggeredByNavigation) {
			return (currentTimeAtLastNote = audioCtx.currentTime)
		}
		stopAudio()
	} else attackTime = minAttackTime

	init(panning)
	generateOscillation(toneIndex)

	currentTimeAtLastNote = audioCtx.currentTime
}

function init(panning?: number) {
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
}

function generateOscillation(toneIndex: number) {
	oscillator.frequency.value = notes[toneIndex].frequency

	const now = audioCtx.currentTime
	const peakVolume = 0.5

	//	silence tone immediately then fade in to prevent jumbled tones when rapidly playing notes
	gainNode.gain.exponentialRampToValueAtTime(0.00001, now)

	//	ramp to peakVolume over attackTime
	gainNode.gain.exponentialRampToValueAtTime(peakVolume, now + attackTime)
	//	drop to releaseVolume over decayTime
	gainNode.gain.linearRampToValueAtTime(
		releaseVolume,
		now + attackTime + decayTime
	)
	//	fade out over releaseTime
	gainNode.gain.exponentialRampToValueAtTime(0.0001, now + noteDuration)

	oscillator.start(now)
	oscillator.stop(now + noteDuration)
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
	if (waitTime! < minimumWaitTimeToThrottleAttack) {
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
		playAudio(arpeggioNotes[curr] - 1)

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
