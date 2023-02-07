<script lang="ts">
	import { onMount, onDestroy, createEventDispatcher } from 'svelte'
	import MockCell from './MockCell.svelte'
	import {
		tutorialSelectedCellStore,
		tutorialRandomlyFilledCellsStore,
		tutorialSelectedNumberStore,
		tutorialErrorsStore,
	} from '../../../stores'

	const dispatch = createEventDispatcher()

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

	export let flashFilled: boolean = false
	export let guessable: boolean = false

	const unsubSelectedCellStore = tutorialSelectedCellStore.subscribe(
		(selectedCell) => {
			if (
				!selectableCells ||
				$tutorialRandomlyFilledCellsStore.indexOf(selectedCell + 1) ===
					-1
			)
				return
			dispatch('play-audio', selectedCell)
		}
	)

	onMount(() => {
		tutorialSelectedNumberStore.set(undefined)
		tutorialSelectedCellStore.set(0)
		tutorialErrorsStore.set(0)
	})

	onDestroy(() => {
		tutorialRandomlyFilledCellsStore.set([])
		unsubSelectedCellStore()
	})
</script>

<div id="cells-grid">
	{#each cellsArray as value, i (i)}
		<MockCell
			{value}
			cycles={cycles ? cycles : undefined}
			activeCellInCycle={Number.isInteger(currentCycleIndex)
				? i === currentCycleIndex
				: undefined}
			selectable={selectableCells}
			{flashFilled}
			{guessable}
			on:play-audio
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
