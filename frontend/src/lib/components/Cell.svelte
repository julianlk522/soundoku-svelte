<script lang="ts">
	import {
	boardStore,
		selectedCellStore,
		selectedCellWithNavigationStore,
		selectedNumberStore,
	} from '../../../src/stores'
	import { onMount, onDestroy } from 'svelte'
	import { fade } from 'svelte/transition'
	import { sineIn } from 'svelte/easing'
	import { createEventDispatcher } from 'svelte'
	import { topLeftToBottomRightStagger } from '../utils/topLeftToBottomRightStagger'
	const dispatch = createEventDispatcher()

	let self: HTMLButtonElement

	export let value: number | undefined = 0
	$: empty = value === undefined

	export let rowIndex = 0
	$: aboveBoxDivider = rowIndex === 2 || rowIndex === 5
	$: belowBoxDivider = rowIndex === 3 || rowIndex === 6

	export let indexInRow = 0
	$: leftOfBoxDivider = indexInRow === 2 || indexInRow === 5
	$: rightOfBoxDivider = indexInRow === 3 || indexInRow === 6

	$: overallIndex = rowIndex * 9 + indexInRow

	export let completedCells: Set<number>
	$: completed = value && completedCells.has(overallIndex)

	let selectedCell: number | undefined
	const unsubSelectedCellStore = selectedCellStore.subscribe(
		(selectedCellIndex) => {
			selectedCell = selectedCellIndex
			if (selectedCellIndex === overallIndex) self?.focus()
		}
	)
	$: selected = selectedCell === overallIndex
	$: selected && handleSelect()
	$: incorrect =
		$selectedNumberStore &&
		selectedCell === overallIndex &&
		$selectedNumberStore !== value
	$: relatedToSelected =
		selectedCell !== undefined &&
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

	$: columnFilled = $boardStore.some((_,index) => index % 9 === indexInRow && completedCells.has(index)) && $boardStore.filter((_, index) => index % 9 === indexInRow).every(cell => cell !== undefined)

	function handleSelect() {
		selectedNumberStore.set(undefined)
		dispatch('select', {
			overallIndex,
			toneIndex: value ? value - 1 : undefined,
		})
	}

	function handleClick() {
		selectedCellWithNavigationStore.set(false)
		if ($selectedCellStore !== overallIndex) {
			return selectedCellStore.set(overallIndex)
		}
		return handleSelect()
		
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.code === "Space") return handleSelect()
		if (event.key === "Tab") return
		if (!value && /^[\d]+$/.test(event.key)) {
			selectedNumberStore.set(+event.key)
		}
	}

	onMount(() => {
		self.style.setProperty('--filled-column-animation-delay', (rowIndex * 0.05).toString())
	})
	onDestroy(unsubSelectedCellStore)
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
	class:column-filled={columnFilled}
	bind:this={self}
	on:click={handleClick}
	on:keydown|preventDefault={handleKeydown}
	in:fade={{
		duration: 200,
		delay: 50 + 10 * topLeftToBottomRightStagger(overallIndex, 9),
		easing: sineIn,
	}}
>
	{#if value && !completed}
		<div class="filled {selected ? 'filled-selected' : ''}" />
	{/if}
	{value !== undefined && completed
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
		border: none;
	}

	.selected:focus,
	.selected:focus-visible {
		outline: none;
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

	.column-filled {
		animation: group-completed 1s ease-out calc(var(--filled-column-animation-delay) * 1s) 1;
	}

	@keyframes group-completed {
		0% {
			opacity: 0.25;
		}
		50% {
			background-color: var(--color-secondary);
		}
	}

	@media (min-width: 640px) {
		.cell {
			font-size: 1.5rem;
		}
	}
</style>
