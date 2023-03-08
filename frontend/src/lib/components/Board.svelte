<script lang="ts">
	import { makepuzzle, solvepuzzle } from 'sudoku'
	import { onMount, createEventDispatcher } from 'svelte'
	import {
		selectedCellStore,
		selectedCellWithNavigationStore,
		selectedNumberStore,
		selectedCellFilledStore,
		boardStore,
	} from '../../../src/stores'
	import Row from './Row.svelte'
	import type { Difficulty } from '../types'

	const dispatch = createEventDispatcher()

	export let difficulty: Difficulty = 'Very Easy'
	$: desiredFilledNumsCount =
		difficulty === 'Very Easy'
			? 70
			: difficulty === 'Easy'
			? 60
			: difficulty === 'Medium'
			? 55
			: difficulty === 'Hard'
			? 50
			: 40
	let board: (number | undefined)[] = []
	let solution: number[]
	let rows: (number | undefined)[][] = []
	let completedCells = new Set<number>()

	$: $selectedCellStore !== undefined &&
		$selectedNumberStore &&
		handleGuess($selectedNumberStore)

	//  split board into groups of 9 and assign product to rows
	function setRows() {
		rows = []
		for (let r = 0; r < 9; r++) {
			rows.push(board.slice(r * 9, r * 9 + 9))
		}
	}

	function fillCellsToDecreaseDifficulty() {
		let filledNumsCount = board.filter(
			(val: number | undefined) => val !== undefined
		).length

		let n = desiredFilledNumsCount - filledNumsCount

		const checkedIndices = []
		while (n > 0) {
			const randomIndex = Math.floor(Math.random() * 81)
			if (
				checkedIndices.indexOf(randomIndex) === -1 &&
				board[randomIndex] === undefined
			) {
				board.splice(randomIndex, 1, solution[randomIndex])
				n--
			}
			checkedIndices.push(randomIndex)
		}	
	}

	function handleCellSelected(event: CustomEvent) {
		if (board[event.detail.overallIndex] !== undefined) {
			selectedCellFilledStore.set(true)
		} else {
			selectedCellFilledStore.set(false)
		}

		if (event.detail.toneIndex !== undefined) {
			const panning = (event.detail.overallIndex % 9) / 4 - 1
			dispatch('play-audio', {
				toneIndex: event.detail.toneIndex,
				triggeredByNavigation: $selectedCellWithNavigationStore,
				panning,
			})
		}
	}

	function handleGuess(num: number) {
		if (
			$selectedCellStore === undefined ||
			board[$selectedCellStore] !== undefined
		)
			return
		if (solution[$selectedCellStore] === num) {
			return handleCorrectGuess()
		}
		dispatch('incorrect-guess')
	}

	function handleCorrectGuess() {
		selectedCellFilledStore.set(true)

		board.splice($selectedCellStore!, 1, solution[$selectedCellStore!])
		boardStore.set(board)

		const filledCells = board.filter(cell => cell !== undefined).length
		const remainingCells = 81 - filledCells
		if (!remainingCells) {
			dispatch('win')
		}

		completedCells.add($selectedCellStore!)
		setRows()
	}

	onMount(() => {
		board = makepuzzle()
		//  solvepuzzle() relies on a range of 0-8 so it must be run before mapping values to 1-9
		solution = solvepuzzle(board).map((num: number) => num + 1)

		board = board.map((num: number | undefined) =>
			num != undefined ? num + 1 : undefined
		)
		fillCellsToDecreaseDifficulty()
		setRows()
		boardStore.set(board)
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
