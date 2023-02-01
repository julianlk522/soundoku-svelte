<script lang="ts">
	import { createEventDispatcher } from 'svelte'
	import { difficulties } from '../types'

	const dispatch = createEventDispatcher()

	function handleDifficultySelect(event: MouseEvent) {
		const targetButton = event.target as HTMLButtonElement
		dispatch('difficulty-select', targetButton.innerText)
	}
</script>

{#each difficulties as difficultyLevel (difficultyLevel)}
	<button
		id={difficultyLevel.toLowerCase().replace(' ', '-')}
		on:click={handleDifficultySelect}>{difficultyLevel}</button
	>
{/each}

<style>
	* {
		--color-difficulty-very-easy: hsl(170deg, 70%, 50%);
		--color-difficulty-easy: hsl(110deg, 60%, 55%);
		--color-difficulty-medium: hsl(40deg, 70%, 50%);
		--color-difficulty-hard: hsl(20deg, 80%, 45%);
		--color-difficulty-very-hard: hsl(0, 90%, 40%);
	}

	button {
		color: var(--color-text);
		margin: 0 0.5rem;
		border: none;
		border-radius: 2px;
	}

	#very-easy {
		background-color: var(--color-difficulty-very-easy);
	}

	#easy {
		background-color: var(--color-difficulty-easy);
	}

	#medium {
		background-color: var(--color-difficulty-medium);
	}

	#hard {
		background-color: var(--color-difficulty-hard);
	}

	#very-hard {
		background-color: var(--color-difficulty-very-hard);
	}
</style>
