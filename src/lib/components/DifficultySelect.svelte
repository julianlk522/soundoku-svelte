<script lang="ts">
	import { createEventDispatcher } from 'svelte'
	import { difficulties } from '../types'

	const dispatch = createEventDispatcher()

	let hovered: number | undefined = undefined

	function handleDifficultySelect(event: MouseEvent) {
		const targetButton = event.target as HTMLButtonElement
		dispatch('difficulty-select', targetButton.innerText)
	}
</script>

{#each difficulties as difficultyLevel (difficultyLevel)}
	<button
		id={difficultyLevel.toLowerCase().replace(' ', '-')}
		class:hovered={hovered === difficulties.indexOf(difficultyLevel)}
		on:click={handleDifficultySelect}
		on:mouseenter={() => (hovered = difficulties.indexOf(difficultyLevel))}
		on:mouseleave={() => (hovered = undefined)}
	>
		<span
			class="button-text"
			class:button-text-hovered={hovered ===
				difficulties.indexOf(difficultyLevel)}
		>
			{hovered === difficulties.indexOf(difficultyLevel)
				? difficultyLevel
				: ''}</span
		>
	</button>
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
		height: 2rem;
		width: 2rem;
		margin: 0 1rem;
		border: none;
		border-radius: 100%;
		transition: none 0.5s cubic-bezier(0.16, 1, 0.3, 1);
		transition-property: height, width, border-radius;
	}

	.hovered {
		width: 6rem;
		border-radius: 4px;
	}

	.button-text {
		display: inline-block;
		opacity: 0;
		transform: translateY(-5px);
		transition-duration: 0.75s, 0.5s;
		transition-timing-function: ease-out;
		transition-property: opacity, transform;
	}

	.button-text-hovered {
		opacity: 1;
		transform: translateY(0);
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
