<script lang="ts">
	import { createEventDispatcher } from 'svelte'

	const dispatch = createEventDispatcher()

	function handleDifficultySelect(event: MouseEvent) {
		const targetButton = event.target as HTMLButtonElement
		dispatch('difficulty-select', targetButton.innerText)
	}

	const difficulties = ['Very Easy', 'Easy', 'Medium', 'Hard', 'Very Hard']
</script>

{#each difficulties as difficultyLevel (difficultyLevel)}
	<button on:click={handleDifficultySelect}>{difficultyLevel}</button>
{/each}

<style>
	button {
		margin: 0 0.5rem;
	}
</style>
