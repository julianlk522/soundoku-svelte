<script lang="ts">
	import { selectedNumberStore, remainingCellsStore } from '../src/stores'
	import { stopAudio, playAudio } from './audio'
	export let value: number

	let cellsRemaining = 81
	remainingCellsStore.subscribe((remaining) => (cellsRemaining = remaining))

	function handleNumberSelect(value: number) {
		selectedNumberStore.set(value)

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
		height: 0.5rem;
		width: 0.5rem;
		padding: 1.5rem;
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

	@media (min-width: 1280px) {
		.selectionButton {
			padding: 3rem;
		}
	}
</style>
