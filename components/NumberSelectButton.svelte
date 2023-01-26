<script lang="ts">
	import {
		selectedNumberStore,
		remainingCellsStore,
		selectedCellFilledStore,
	} from '../src/stores'
	import { stopAudio, playAudio } from './utils/audio'
	export let value: number

	let cellsRemaining = 81
	remainingCellsStore.subscribe((remaining) => (cellsRemaining = remaining))

	function handleNumberSelect(value: number) {
		if (!$selectedCellFilledStore) {
			selectedNumberStore.set(value)
		}

		if (cellsRemaining) {
			stopAudio()
			playAudio(value - 1)
		}
	}
</script>

<button class="selectionButton" on:click={() => handleNumberSelect(value)}
	>{value}</button
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
