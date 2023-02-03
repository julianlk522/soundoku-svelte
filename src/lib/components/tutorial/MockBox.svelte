<script lang="ts">
	import { onMount, onDestroy } from 'svelte'
	import MockCell from './MockCell.svelte'
	import {
		tutorialSelectedCellStore,
		tutorialRandomlyFilledCellsStore,
		selectedNumberStore,
		tutorialErrorsStore,
	} from '../../../stores'

	export let selectableCells: boolean = false
	export let index: number | undefined = undefined
	export let cycles: number | undefined = undefined

	const cellsArray = Array.from(Array(9)).map((_, i) => i + 1)

	export let randomlyFilled: boolean = false
	$: randomlyFilled &&
		tutorialRandomlyFilledCellsStore.set(
			cellsArray.filter(
				(val) => val > Math.floor(Math.random() + 0.5) * val
			)
		)

	export let flashFilled: boolean = false
	export let guessable: boolean = false

	onMount(() => {
		selectedNumberStore.set(null)
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
			activeCellInCycle={Number.isInteger(index)
				? i === index
				: undefined}
			selectable={selectableCells}
			{flashFilled}
			{guessable}
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
