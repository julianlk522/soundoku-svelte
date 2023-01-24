<script lang="ts">
	import { selectedCellStore, selectedNumberStore } from '../src/stores'
	import { fade } from 'svelte/transition'
	import { createEventDispatcher } from 'svelte'
	const dispatch = createEventDispatcher()

	export let value: number | null = 0
	$: empty = value === null
	export let rowIndex = 0
	$: bottomEdgeOfLocalBox = rowIndex === 2 || rowIndex === 5
	export let indexInRow = 0
	$: rightEdgeOfLocalBox = indexInRow === 2 || indexInRow === 5
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

	function handleSelect() {
		dispatch('select', { index: rowIndex * 9 + indexInRow, value })
	}

	function handleKeydown(event: KeyboardEvent) {
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
	class:selected
	class:related-to-selected={relatedToSelected}
	class:bottom-edge-of-local-box={bottomEdgeOfLocalBox}
	class:right-edge-of-local-box={rightEdgeOfLocalBox}
	on:click={handleSelect}
	on:keydown={handleKeydown}
	in:fade={{ duration: 200, delay: 10 * (rowIndex * 9 + indexInRow) }}
>
	{value !== null || completed ? value : ''}
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
		background: #eee;
		font-weight: 700;
		border: 2px solid #bbb;
	}

	.selected {
		background-color: var(--color-primary);
		color: var(--color-text-light);
	}

	.related-to-selected {
		background-color: var(--color-primary-ultrasoft);
	}

	.selected-empty {
		background-color: var(--color-primary-soft);
	}

	.selected-completed {
		background-color: var(--color-secondary-muted);
	}

	.completed {
		background-color: var(--color-secondary);
	}

	.bottom-edge-of-local-box {
		border-bottom: 4px solid black;
	}

	.right-edge-of-local-box {
		border-right: 4px solid black;
	}

	@media (min-width: 640px) {
		.cell {
			font-size: 1.5rem;
		}
	}
</style>
