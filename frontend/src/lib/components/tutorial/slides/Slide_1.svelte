<script lang="ts">
	import { onMount, onDestroy } from 'svelte'
	import { sineIn } from 'svelte/easing'
	import { fade } from 'svelte/transition'
	import { create_in_transition } from 'svelte/internal'
	import MockBox from '../MockBox.svelte'

	let cycleInterval: NodeJS.Timeout
	let ascending = true
	let currentCycleIndex = 0
	let cycles = 0
	let text1: HTMLElement
	let text2: HTMLElement

	onMount(() => {
		cycleInterval = setInterval(() => {
			if (cycles % 2 === 0) {
				if (ascending && currentCycleIndex === 8) {
					ascending = false
					currentCycleIndex--
				} else if (!ascending && !currentCycleIndex) {
					ascending = true
					cycles++
				} else if (ascending) {
					currentCycleIndex++
				} else currentCycleIndex--
			} else {
				if (ascending && currentCycleIndex === 8) {
					ascending = false
					currentCycleIndex -= 3
				} else if (!ascending && currentCycleIndex === 0) {
					ascending = true
					cycles++
				} else if (ascending && currentCycleIndex === 5) {
					currentCycleIndex += 3
				} else if (!ascending && currentCycleIndex - 3 < 0) {
					currentCycleIndex = currentCycleIndex + 8 - 3
				} else if (ascending) {
					currentCycleIndex = (currentCycleIndex + 3) % 8
				} else {
					currentCycleIndex -= 3
				}
			}
		}, 200)
	})

	onMount(() => {
		create_in_transition(text1, fade, {
			duration: 1000,
			easing: sineIn,
		}).start()
		create_in_transition(text2, fade, {
			duration: 1000,
			delay: 1000,
			easing: sineIn,
		}).start()
	})

	onDestroy(() => {
		clearInterval(cycleInterval)
	})
</script>

<h2 bind:this={text1}>Hey! Thanks for checking out Soundoku.</h2>
<h3 bind:this={text2}>
	This is a brief, optional interactive tutorial to walk you through how to
	play the game.
</h3>
<MockBox {currentCycleIndex} {cycles} />

<style>
	h2,
	h3 {
		margin-bottom: 1rem;
		color: var(--color-text-light);
	}
</style>
