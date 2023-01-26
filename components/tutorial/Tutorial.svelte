<script lang="ts">
	import { createEventDispatcher, onMount, onDestroy } from 'svelte'
	import MockCell from './MockCell.svelte'
	const dispatch = createEventDispatcher()

	const cellsArray = Array.from(Array(9)).map((_, i) => i + 1)

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
				} else if (!ascending) {
					index--
				} else index++
			} else {
				if (ascending && index === 8) {
					ascending = false
					index -= 3
				} else if (!ascending && index === 0) {
					ascending = true
					cycles++
				} else if (ascending && index === 5) {
					index = 8
				} else if (ascending) {
					index = (index + 3) % 8
				} else if (index - 3 < 0) {
					index = index + 8 - 3
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

<div id="tutorial">
	<h2>Hey! Thanks for checking out Soundoku.</h2>
	<h3>
		This is a brief, optional interactive tutorial to walk you through how
		to play the game.
	</h3>

	<div id="tutorial-cells-grid">
		{#each cellsArray as value, i}
			<MockCell {value} active={i === index} {cycles} />
		{/each}
	</div>

	<div id="tutorial-navigation-buttons">
		<button>Continue</button>
		<button on:click={() => dispatch('skip-tutorial')}>Skip tutorial</button
		>
	</div>
</div>

<style>
	#tutorial {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 1rem;
		padding: 2rem;
	}

	#tutorial > * {
		color: var(--color-text-light);
	}

	#tutorial > h2,
	h3 {
		margin-bottom: 1rem;
	}

	#tutorial-cells-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		margin: 2rem 0;
		background-color: #eee;
	}

	#tutorial-navigation-buttons {
		display: flex;
		justify-content: space-evenly;
		gap: 2rem;
	}

	#tutorial-navigation-buttons > button {
		color: var(--color-text);
	}

	#tutorial-navigation-buttons > button:hover {
		background-color: var(--color-text-light);
	}
</style>
