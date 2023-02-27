<script lang="ts">
	import { createEventDispatcher } from 'svelte'
	import {
		selectedCellWithNavigationStore,
		tutorialSelectedNumberStore,
	} from '../../../stores'
	import NumberSelectButton from '../NumberSelectButton.svelte'

	const dispatch = createEventDispatcher()

	let nums = Array.from(Array(9)).map((_, i) => i + 1)

	export let errors = 0
	export let showErrors: boolean = false

	function handleNumberSelected(event: CustomEvent) {
		tutorialSelectedNumberStore.set(event.detail + 1)
		selectedCellWithNavigationStore.set(false)
		dispatch('play-audio', event.detail)
	}
</script>

<div class="flex-column">
	<div id="selection-grid">
		{#each nums as num (num)}
			<NumberSelectButton
				value={num}
				on:play-audio={handleNumberSelected}
			/>
		{/each}
	</div>
	{#if showErrors}
		<h3 id="errors">Errors: {errors}</h3>
	{/if}
</div>

<style>
	.flex-column {
		display: flex;
		flex-direction: column;
	}

	#selection-grid {
		width: auto;
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1rem;
		align-items: center;
	}

	#errors {
		color: var(--color-text-light);
		margin-top: 1rem;
		font-size: 1rem;
		text-align: center;
	}

	@media (min-width: 640px) {
		#errors {
			font-size: 1.5rem;
		}
	}
</style>
