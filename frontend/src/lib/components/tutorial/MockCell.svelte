<script lang="ts">
	import { onMount, onDestroy, createEventDispatcher } from 'svelte'
	import {
		tutorialSelectedCellStore,
		tutorialRandomlyFilledCellsStore,
		tutorialErrorsStore,
		tutorialSelectedNumberStore,
		selectedCellWithNavigationStore,
	} from '../../../stores'
	import { sineIn } from 'svelte/easing'
	import { fade } from 'svelte/transition'
	import { topLeftToBottomRightStagger } from '../../utils/topLeftToBottomRightStagger'

	const dispatch = createEventDispatcher()

	let self: HTMLButtonElement
	export let value: number
	$: index = value - 1
	export let selectable: boolean = false
	$: selected = selectable && $tutorialSelectedCellStore === index
	$: selected && handleSelect()
	export let cycles: number = 0
	export let activeCellInCycle: boolean = false
	$: cellHueTertiary =
		cycles && activeCellInCycle && Math.floor(cycles / 2) % 2 === 0
	$: cellHueQuaternary =
		cycles && activeCellInCycle && Math.floor(cycles / 2) % 3 === 0
	$: filled =
		$tutorialRandomlyFilledCellsStore &&
		$tutorialRandomlyFilledCellsStore.indexOf(value) !== -1
	export let flashFilled: boolean
	export let guessable: boolean = false
	let correct = false
	$: incorrect =
		guessable &&
		selected &&
		!filled &&
		$tutorialSelectedNumberStore &&
		value !== $tutorialSelectedNumberStore

	function handleSelect() {
		//	reset tutorialSelectedNumberStore after each new cell selected (prevent applying incorrect class after navigation)
		tutorialSelectedNumberStore.set(undefined)
		//	play tone only if cell is filled
		if (
			$tutorialRandomlyFilledCellsStore.indexOf(value) !== -1 ||
			correct
		) {
			dispatch('play-audio', index)
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.code === "Space") return handleSelect()
		if (event.key === 'Tab') {
			return dispatch('select-back-button')
		}
		if (!filled && !correct && /\d/.test(event.key)) {
			tutorialSelectedNumberStore.set(+event.key)
		}
	}

	function handleClick() {
		selectedCellWithNavigationStore.set(false)
		if ($tutorialSelectedCellStore !== index) {
			tutorialSelectedCellStore.set(index)
		}
		return handleSelect()
		
	}

	const unsubTutorialSelectedCellStore = tutorialSelectedCellStore.subscribe(
		(selectedCellIndex) => {
			if (selectedCellIndex === index) self?.focus()
		}
	)

	const unsubTutorialSelectedNumberStore =
		tutorialSelectedNumberStore.subscribe((newNum) => {
			if (!guessable || !selected || filled || newNum === undefined)
				return
			if (newNum === value) return (correct = true)
			if (correct) return
			tutorialErrorsStore.update((errors) => errors + 1)
		})

	onMount(() => {
		if (!filled || !flashFilled) return
		self.style.setProperty(
			'--flash-filled-delay',
			($tutorialRandomlyFilledCellsStore.indexOf(value) / 2).toString()
		)
		self.style.setProperty(
			'--flash-filled-duration',
			($tutorialRandomlyFilledCellsStore.length / 2).toString()
		)
	})

	onDestroy(() => {
		unsubTutorialSelectedCellStore()
		unsubTutorialSelectedNumberStore()
	})
</script>

{#key Math.floor(cycles / 2)}
	<button
		tabindex={selectable ? 0 : -1}
		class="cell"
		class:cell-non-selectable={!selectable}
		class:selected
		class:selected-completed={selected && correct}
		class:cell-hue-secondary={activeCellInCycle}
		class:cell-hue-tertiary={cellHueTertiary || incorrect}
		class:cell-hue-quaternary={cellHueQuaternary || correct}
		bind:this={self}
		on:click|stopPropagation={handleClick}
		on:keydown|preventDefault={handleKeydown}
		in:fade={{
			duration: 200,
			easing: sineIn,
			delay: 50 + 10 * topLeftToBottomRightStagger(index, 3),
		}}
	>
		{#if filled}
			<div
				class="filled {selected ? 'filled-selected' : ''} {flashFilled
					? 'flash-filled'
					: ''}"
			/>
		{/if}
		{!$tutorialRandomlyFilledCellsStore.length || correct
			? value
			: incorrect
			? $tutorialSelectedNumberStore
			: ''}
	</button>
{/key}

<style>
	.cell {
		position: relative;
		height: clamp(1.75rem, 5vmax, 4rem);
		width: clamp(1.75rem, 5vmax, 4rem);
		background-color: #eee;
		font-size: 1.5rem;
		font-weight: 700;
		border: 1px solid #aaa;
	}

	.cell-non-selectable {
		pointer-events: none;
	}

	.filled {
		position: absolute;
		left: 4px;
		top: 4px;
		height: 8px;
		width: 8px;
		background-color: var(--color-secondary-soft);
		border-radius: 5px;
	}

	.filled-selected {
		background-color: var(--color-secondary);
	}

	.flash-filled {
		background-color: transparent;
		animation: flash-filled calc(var(--flash-filled-duration) * 1s) linear
			calc(var(--flash-filled-delay) * 1s) infinite;
	}

	@keyframes flash-filled {
		0%,
		100% {
			background-color: transparent;
		}
		25%,
		75% {
			background-color: var(--color-secondary-soft);
		}
		50% {
			background-color: var(--color-secondary);
		}
	}

	.selected {
		background-color: var(--color-primary);
		color: var(--color-text-light);
	}

	.selected:focus {
		outline: none;
	}

	.cell-hue-secondary {
		background-color: var(--color-primary-soft);
		color: var(--color-text-light);
	}

	.cell-hue-tertiary {
		background-color: var(--color-accent-muted);
	}

	.cell-hue-quaternary {
		background-color: var(--color-secondary-soft);
		color: var(--color-text);
	}

	.selected-completed {
		background-color: var(--color-secondary-muted);
		color: var(--color-text-light);
	}

	@media (min-width: 640px) {
		.cell {
			font-size: 1.5rem;
		}
	}
</style>
