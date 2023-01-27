<script lang="ts">
	import { selectedCellStore, selectedNumberStore } from '../src/stores'
	import { fade } from 'svelte/transition'
	import { sineIn } from 'svelte/easing'
	import { createEventDispatcher } from 'svelte'
	import { keys } from './utils/keyboardNavigation'
	import { topLeftToBottomRightStagger } from './utils/topLeftToBottomRightStagger'
	const dispatch = createEventDispatcher()

	let self: HTMLButtonElement

	export let value: number | null = 0
	$: empty = value === null

	export let rowIndex = 0
	$: aboveBoxDivider = rowIndex === 2 || rowIndex === 5
	$: belowBoxDivider = rowIndex === 3 || rowIndex === 6

	export let indexInRow = 0
	$: leftOfBoxDivider = indexInRow === 2 || indexInRow === 5
	$: rightOfBoxDivider = indexInRow === 3 || indexInRow === 6

	export let completedCells: Set<number>
	$: completed = value && completedCells.has(rowIndex * 9 + indexInRow)

	let selectedCell: number | null
	selectedCellStore.subscribe((index) => {
		selectedCell = index
		if (index === rowIndex * 9 + indexInRow) self?.focus()
	})
	$: selected = selectedCell === rowIndex * 9 + indexInRow
	$: incorrect =
		$selectedNumberStore &&
		selectedCell === rowIndex * 9 + indexInRow &&
		$selectedNumberStore !== value
	$: relatedToSelected =
		selectedCell !== null &&
		!selected &&
		//	same row
		((selectedCell >= rowIndex * 9 && selectedCell < (rowIndex + 1) * 9) ||
			// same col
			selectedCell % 9 === indexInRow ||
			//	same box
			//	same box rows
			(Math.floor(selectedCell / 27) === Math.floor(rowIndex / 3) &&
				//	same box cols
				Math.floor((selectedCell % 9) / 3) ===
					Math.floor(indexInRow / 3)))
	$: relatedToSelectedIncorrect =
		relatedToSelected && completed && value === $selectedNumberStore

	function handleSelect() {
		selectedNumberStore.set(null)
		dispatch('select', { index: rowIndex * 9 + indexInRow, value })
	}

	function handleKeydown(event: KeyboardEvent) {
		if (!value && /\d/.test(event.key)) {
			selectedNumberStore.set(+event.key)
		}
	}
</script>

<button
	class="cell {selected
		? empty
			? 'selected-empty'
			: completed
			? 'selected-completed'
			: ''
		: ''}"
	class:completed
	class:incorrect
	class:selected
	class:related-to-selected={relatedToSelected}
	class:related-to-selected-incorrect={relatedToSelectedIncorrect}
	class:above-box-divider={aboveBoxDivider}
	class:below-box-divider={belowBoxDivider}
	class:left-of-box-divider={leftOfBoxDivider}
	class:right-of-box-divider={rightOfBoxDivider}
	bind:this={self}
	on:focus={handleSelect}
	on:keydown={handleKeydown}
	in:fade={{
		duration: 200,
		delay:
			50 + 10 * topLeftToBottomRightStagger(rowIndex * 9 + indexInRow, 9),
		easing: sineIn,
	}}
>
	{#if value && !completed}
		<div class="filled {selected ? 'filled-selected' : ''}" />
	{/if}
	{value !== null && completed
		? value
		: incorrect
		? $selectedNumberStore
		: ''}
</button>

<style>
	.cell {
		position: relative;
		height: clamp(1.75rem, 5vmax, 4rem);
		width: clamp(1.75rem, 5vmax, 4rem);
		max-height: 10vw;
		max-width: 10vw;
		background-color: #eee;
		font-weight: 700;
		border: 1px solid #aaa;
	}

	.filled {
		height: 8px;
		width: 8px;
		position: absolute;
		top: 4px;
		left: 4px;
		background-color: var(--color-secondary-soft);
		border-radius: 5px;
	}

	.filled-selected {
		background-color: var(--color-secondary);
	}
	.selected {
		background-color: var(--color-primary);
		color: var(--color-text-light);
	}

	.selected-empty {
		background-color: var(--color-primary-soft);
	}

	.related-to-selected {
		background-color: var(--color-primary-ultrasoft);
	}

	.completed {
		background-color: var(--color-secondary-soft);
	}

	.selected-completed {
		background-color: var(--color-secondary-muted);
	}

	.related-to-selected-incorrect {
		background-color: var(--color-accent-soft);
	}

	.incorrect {
		background-color: var(--color-accent-muted);
	}

	.above-box-divider {
		border-bottom: 4px solid black;
	}

	.below-box-divider {
		border-top: none;
	}

	.left-of-box-divider {
		border-right: 4px solid black;
	}

	.right-of-box-divider {
		border-left: none;
	}

	@media (min-width: 640px) {
		.cell {
			font-size: 1.5rem;
		}
	}
</style>
