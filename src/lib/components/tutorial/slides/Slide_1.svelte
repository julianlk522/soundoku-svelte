<script lang="ts">
	import { onMount, onDestroy } from 'svelte'
	import MockBox from '../MockBox.svelte'

	let cycleInterval: NodeJS.Timeout
	let ascending = true
	let index = 0
	let cycles = 0

	onMount(() => {
		cycleInterval = setInterval(() => {
			if (cycles % 2 === 0) {
				if (ascending && index === 8) {
					ascending = false
					index--
				} else if (!ascending && !index) {
					ascending = true
					cycles++
				} else if (ascending) {
					index++
				} else index--
			} else {
				if (ascending && index === 8) {
					ascending = false
					index -= 3
				} else if (!ascending && index === 0) {
					ascending = true
					cycles++
				} else if (ascending && index === 5) {
					index += 3
				} else if (!ascending && index - 3 < 0) {
					index = index + 8 - 3
				} else if (ascending) {
					index = (index + 3) % 8
				} else {
					index -= 3
				}
			}
		}, 200)
	})

	onDestroy(() => {
		clearInterval(cycleInterval)
	})
</script>

<h2>Hey! Thanks for checking out Soundoku.</h2>
<h3>
	This is a brief, optional interactive tutorial to walk you through how to
	play the game.
</h3>

<MockBox {index} {cycles} />

<style>
	h2,
	h3 {
		margin-bottom: 1rem;
		color: var(--color-text-light);
	}
</style>
