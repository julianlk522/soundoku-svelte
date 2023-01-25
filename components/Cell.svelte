<script lang="ts">
	import { topLeftToBottomRightStagger } from './topLeftToBottomRightStagger'
	import { selectedCellStore, selectedNumberStore } from '../src/stores'
	import { fade } from 'svelte/transition'
	import { sineIn } from 'svelte/easing'
	import { createEventDispatcher } from 'svelte'
	const dispatch = createEventDispatcher()

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
	selectedCellStore.subscribe((index) => (selectedCell = index))

	$: selected = selectedCell === rowIndex * 9 + indexInRow
	$: relatedToSelected =
		selectedCell &&
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
		relatedToSelected && value === $selectedNumberStore
	$: incorrect =
		$selectedNumberStore &&
		selectedCell === rowIndex * 9 + indexInRow &&
		$selectedNumberStore !== value

	function handleSelect() {
		selectedNumberStore.set(0)
		dispatch('select', { index: rowIndex * 9 + indexInRow, value })
	}

	function handleKeydown(event: KeyboardEvent) {
		if (value) return
		if (/\d/.test(event.key)) {
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
	on:click={handleSelect}
	on:keydown={handleKeydown}
	in:fade={{
		duration: 200,
		delay:
			50 + 10 * topLeftToBottomRightStagger(rowIndex * 9 + indexInRow, 9),
		easing: sineIn,
	}}
>
	{value !== null || completed
		? value
		: incorrect
		? $selectedNumberStore
		: ''}
</button>

<style>
	.cell {
		height: clamp(1.75rem, 5vmax, 4rem);
		width: clamp(1.75rem, 5vmax, 4rem);
		max-height: 10vw;
		max-width: 10vw;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #eee;
		font-weight: 700;
		border: 1px solid #aaa;
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
