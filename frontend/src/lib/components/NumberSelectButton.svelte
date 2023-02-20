<script lang="ts">
	import { onDestroy, createEventDispatcher } from 'svelte'
	import {
		remainingCellsStore,
		selectedCellFilledStore,
		selectedNumberStore,
	} from '../../stores'

	const dispatch = createEventDispatcher()

	export let value: number

	let cellsRemaining = 81
	const unsubRemainingCellStore = remainingCellsStore.subscribe(
		(remaining) => (cellsRemaining = remaining)
	)

	function handleNumberSelect(value: number) {
		//	todo: don't run this during tutorial
		if (!$selectedCellFilledStore) {
			selectedNumberStore.set(value)
		}
		if (cellsRemaining) dispatch('play-audio', value - 1)
	}

	onDestroy(unsubRemainingCellStore)
</script>

<button
	class="selectionButton"
	on:click|stopPropagation={() => handleNumberSelect(value)}>{value}</button
>

<style>
	.selectionButton {
		color: var(--color-primary);
		font-size: 1.5rem;
		font-weight: 700;
		display: flex;
		height: clamp(2.5rem, 5vmax, 6rem);
		width: clamp(2.5rem, 5vmax, 6rem);
		justify-content: center;
		align-items: center;
		background: #eee;
		border-radius: 0.25rem;
		box-shadow: 0px 0px 4px rgb(0 0 0 / 25%);
	}

	.selectionButton:hover {
		background: #ccc;
	}

	.selectionButton:active {
		box-shadow: 0px 0px 2px 1px rgb(0 0 0 / 25%);
	}

	@media (min-width: 640px) {
		.selectionButton {
			padding: 2rem;
		}
	}
</style>
