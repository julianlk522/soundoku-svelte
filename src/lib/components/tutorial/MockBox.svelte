<script lang="ts">
	import { onMount, onDestroy } from 'svelte'
	import MockCell from './MockCell.svelte'
	import {
		tutorialSelectedCellStore,
		tutorialRandomlyFilledCellsStore,
		selectedNumberStore,
		tutorialErrorsStore,
	} from '../../../stores'
	import { keys } from '../../utils/keyboardNavigation'

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

	function handleKeydown(event: KeyboardEvent) {
		if (!selectableCells) return

		if (keys.hasOwnProperty(event.key)) {
			navigateBox(event.key)
		}
	}

	function navigateBox(key: string) {
		selectedNumberStore.set(null)
		//	left edge
		if (keys[key] === -1 && $tutorialSelectedCellStore! % 3 === 0) {
			tutorialSelectedCellStore.update((cell) => cell + 2)
		}
		//	right edge
		else if (keys[key] === 1 && $tutorialSelectedCellStore! % 3 === 2) {
			tutorialSelectedCellStore.update((cell) => cell - 2)
		}
		//	top edge
		else if (
			keys[key] === -9 &&
			Math.floor($tutorialSelectedCellStore! / 3) === 0
		) {
			tutorialSelectedCellStore.update(
				(cell) => cell + 9 + Math.ceil(keys[key] / 3)
			)
		}
		//	bottom edge
		else if (
			keys[key] === 9 &&
			Math.floor($tutorialSelectedCellStore! / 3) === 2
		) {
			tutorialSelectedCellStore.update(
				(cell) => cell - 9 + Math.ceil(keys[key] / 3)
			)
		}
		//	not at an edge
		else if (keys[key] > 0) {
			tutorialSelectedCellStore.update(
				(cell) => cell + Math.ceil(keys[key] / 3)
			)
		} else {
			tutorialSelectedCellStore.update(
				(cell) => cell + Math.floor(keys[key] / 3)
			)
		}
	}

	onMount(() => {
		tutorialErrorsStore.set(0)
	})

	onDestroy(() => {
		tutorialSelectedCellStore.set(0)
		tutorialRandomlyFilledCellsStore.set([])
	})
</script>

<div id="cells-grid" on:keydown={handleKeydown}>
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
