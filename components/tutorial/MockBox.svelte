<script lang="ts">
	import MockCell from './MockCell.svelte'
	import { tutorialSelectedCellStore } from '../../src/stores'
	import { keys } from '../utils/keyboardNavigation'
	import { playAudio, stopAudio } from '../utils/audio'

	export let selectableCells: boolean = false
	tutorialSelectedCellStore.subscribe((selectedCell) => {
		if (
			!selectableCells ||
			randomlyFilledCells?.indexOf(selectedCell + 1) === -1
		)
			return
		stopAudio()
		playAudio(selectedCell)
	})

	export let index: number | undefined = undefined
	export let cycles: number | undefined = undefined

	const cellsArray = Array.from(Array(9)).map((_, i) => i + 1)

	export let randomlyFilled: boolean = false
	$: randomlyFilledCells = randomlyFilled
		? cellsArray.filter(
				(val) => val > Math.floor(Math.random() + 0.5) * val
		  )
		: undefined
	export let flashFilled: boolean = false

	function handleKeydown(event: KeyboardEvent) {
		if (!selectableCells) return

		if (keys.hasOwnProperty(event.key)) {
			navigateBox(event.key)
		}
	}

	function navigateBox(key: string) {
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
</script>

<div id="cells-grid" on:keydown={handleKeydown}>
	{#each cellsArray as value, i (i)}
		<MockCell
			{value}
			selectable={selectableCells}
			active={Number.isInteger(index) ? i === index : undefined}
			cycles={cycles ? cycles : undefined}
			{randomlyFilledCells}
			{flashFilled}
		/>
	{/each}
</div>

<style>
	#cells-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		margin: 2rem 0;
		background-color: #eee;
	}
</style>
