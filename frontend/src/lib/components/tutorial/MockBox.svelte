<script lang="ts">
	import { onMount, onDestroy } from 'svelte'
	import MockCell from './MockCell.svelte'
	import {
		tutorialSelectedCellStore,
		tutorialRandomlyFilledCellsStore,
		tutorialSelectedNumberStore,
		tutorialErrorsStore,
	} from '../../../stores'

	export let selectableCells: boolean = false
	export let cycles: number | undefined = undefined
	export let currentCycleIndex: number | undefined = undefined

	const cellsArray = Array.from(Array(9)).map((_, i) => i + 1)

	export let randomlyFilled: boolean = false
	$: randomlyFilled &&
		tutorialRandomlyFilledCellsStore.set(
			cellsArray.filter(
				(val) => val > Math.floor(Math.random() + 0.5) * val
			)
		)
	let completedCellCount = randomlyFilled ? 0 : undefined
	let boxFilled = randomlyFilled ? false : undefined

	export let flashFilled: boolean = false
	export let guessable: boolean = false

	function checkForCompleteBox() {
		completedCellCount!++
		if (completedCellCount! + $tutorialRandomlyFilledCellsStore.length === 9) {
			boxFilled = true
		}
	}

	onMount(() => {
		tutorialSelectedNumberStore.set(undefined)
		tutorialSelectedCellStore.set(0)
		tutorialErrorsStore.set(0)
	})

	onDestroy(() => {
		tutorialRandomlyFilledCellsStore.set([])
	})
</script>

<div id="cells-grid">
	{#each cellsArray as value, i (i)}
		<MockCell
			{value}
			cycles={cycles ? cycles : undefined}
			activeCellInCycle={currentCycleIndex !== undefined
				? currentCycleIndex === i
				: undefined}
			selectable={selectableCells}
			{flashFilled}
			{guessable}
			{boxFilled}
			on:play-audio
			on:select-back-button
			on:correct-guess={checkForCompleteBox}
		/>
	{/each}
</div>

<style>
	#cells-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		margin-bottom: 1rem;
		background-color: #eee;
	}
</style>
