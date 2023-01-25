<script lang="ts">
	import {
		selectedCellStore,
		selectedNumberStore,
		remainingCellsStore,
		selectedCellFilledStore,
	} from '../src/stores'
	import { onMount, createEventDispatcher } from 'svelte'
	import { makepuzzle, solvepuzzle } from 'sudoku'
	import { playAudio, stopAudio, playArpeggio } from './audio'
	import Row from './Row.svelte'

	const dispatch = createEventDispatcher()

	let board: (number | null)[] = []
	let solution: number[]
	let rows: (number | null)[][] = []
	let completedCells = new Set<number>()

	selectedCellStore.set(null)
	$: $selectedCellStore
	$: $selectedNumberStore && handleGuess($selectedNumberStore)
	remainingCellsStore.set(81)
	$: Number.isInteger($remainingCellsStore) &&
		checkForWin($remainingCellsStore)

	//  split board into groups of 9 and assign product to rows
	function setRows() {
		rows = []
		for (let r = 0; r < 9; r++) {
			rows.push(board.slice(r * 9, r * 9 + 9))
		}
	}

	function fillCellsToDecreaseDifficulty() {
		let filledNumsCount = board.filter(
			(val: number | null) => val !== null
		).length

		const desiredFilledNumsCount = 50
		let n = desiredFilledNumsCount - filledNumsCount

		const checkedIndices = []
		while (n > 0) {
			const randomIndex = Math.floor(Math.random() * 81)
			if (
				checkedIndices.indexOf(randomIndex) === -1 &&
				board[randomIndex] === null
			) {
				board.splice(randomIndex, 1, solution[randomIndex])
				n--
			}
			checkedIndices.push(randomIndex)
		}
		remainingCellsStore.set(81 - desiredFilledNumsCount)
	}

	function handleCellSelected(event: CustomEvent) {
		selectedCellStore.set(event.detail.index)

		if (board[event.detail.index] !== null) {
			selectedCellFilledStore.set(true)
		} else {
			selectedCellFilledStore.set(false)
		}

		if (event.detail.value !== null) {
			stopAudio()

			const panning = (event.detail.index % 9) / 4 - 1
			playAudio(event.detail.value - 1, panning)
		}
	}

	function handleGuess(num: number) {
		if ($selectedCellStore === null || board[$selectedCellStore] !== null)
			return
		if (solution[$selectedCellStore] === num) {
			return handleCorrectGuess()
		}
		dispatch('incorrect-guess')
	}

	function handleCorrectGuess() {
		//  just for TS linting, even though this condition is impossible
		if ($selectedCellStore === null) return

		remainingCellsStore.update((n) => n - 1)
		selectedCellFilledStore.set(true)
		board.splice($selectedCellStore, 1, solution[$selectedCellStore])
		setRows()
		completedCells.add($selectedCellStore)
	}

	function checkForWin(remaining: number) {
		if (!remaining) {
			stopAudio()
			playArpeggio()
			dispatch('win')
		}
	}

	onMount(() => {
		board = makepuzzle()

		//  solvepuzzle() relies on a range of 0-8 so it must be run before mapping values to 1-9
		solution = solvepuzzle(board).map((num: number) => num + 1)

		board = board.map((num: number | null) =>
			num != null ? num + 1 : null
		)
		fillCellsToDecreaseDifficulty()

		setRows()
	})
</script>

<div id="board">
	{#each rows as row, i}
		<Row
			rowIndex={i}
			{row}
			{completedCells}
			on:select={handleCellSelected}
		/>
	{/each}
</div>

<style>
	#board {
		width: min-content;
		max-width: 90%;
		border: 2px solid black;
		margin-bottom: 2rem;
		background-color: #eee;
	}

	@media (min-width: 640px) {
		#board {
			margin-bottom: 4rem;
		}
	}

	@media (min-width: 896px) {
		#board {
			margin-bottom: 0rem;
		}
	}
</style>
