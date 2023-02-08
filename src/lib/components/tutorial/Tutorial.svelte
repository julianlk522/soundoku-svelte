<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte'
	import { tutorialSelectedCellStore } from '../../../stores'
	import Slide_1 from './slides/Slide_1.svelte'
	import Slide_2 from './slides/Slide_2.svelte'
	import Slide_3 from './slides/Slide_3.svelte'
	import Slide_4 from './slides/Slide_4.svelte'
	import Slide_5 from './slides/Slide_5.svelte'
	import Slide_6 from './slides/Slide_6.svelte'
	import Slide_7 from './slides/Slide_7.svelte'
	import { keys } from '../../utils/keyboardNavigation'
	const dispatch = createEventDispatcher()

	let continueButton: HTMLButtonElement

	const slides = [
		Slide_1,
		Slide_2,
		Slide_3,
		Slide_4,
		Slide_5,
		Slide_6,
		Slide_7,
	]
	let currSlide = 0
	const slidesWithMockBoxes = [3, 5, 6]
	const indexesOfSlidesWithMockBoxes = slidesWithMockBoxes.map(
		(slide) => slide - 1
	)
	const slidesWithMockNumberSelects = [4, 5]
	const indexesOfSlidesWithMockNumberSelects =
		slidesWithMockNumberSelects.map((slide) => slide - 1)

	const slidesWithGuessableMockBoxes = [5, 6]
	const indexesOfSlidesWithGuessableMockBoxes =
		slidesWithGuessableMockBoxes.map((slide) => slide - 1)

	function nextSlide() {
		if (currSlide < slides.length - 1) currSlide++
		else return dispatch('end-tutorial')
		focusContinueButtonIfNeeded()
	}
	function prevSlide() {
		currSlide--
		focusContinueButtonIfNeeded()
	}

	function focusContinueButtonIfNeeded() {
		//	todo: replace this ugly solution with a nicer one
		if (currSlide === 1 || currSlide === 3 || currSlide === 6)
			continueButton.focus()
	}

	function handleKeydown(event: KeyboardEvent) {
		if (
			keys.hasOwnProperty(event.key) &&
			indexesOfSlidesWithMockBoxes.indexOf(currSlide) !== -1
		) {
			return navigateBox(event.key)
		}
		if (
			/\d/.test(event.key) &&
			(indexesOfSlidesWithMockNumberSelects.indexOf(currSlide) !== -1 ||
				indexesOfSlidesWithGuessableMockBoxes.indexOf(currSlide) !== -1)
		) {
			return dispatch('play-audio', +event.key - 1)
		}
		if (event.key.toLowerCase() === 't') return dispatch('end-tutorial')
		if (event.key.toLowerCase() === 'c') return nextSlide()
		if (event.key.toLowerCase() === 'p' && currSlide) return prevSlide()
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

	onMount(() => continueButton.focus())
</script>

<div
	id="tutorial"
	on:keydown|stopPropagation={handleKeydown}
	on:click={() => continueButton.focus()}
>
	<svelte:component this={slides[currSlide]} on:play-audio />

	<div id="tutorial-navigation-buttons">
		{#if currSlide}
			<button
				class="has-arrow"
				on:click={() => {
					currSlide--
					focusContinueButtonIfNeeded()
				}}
			>
				(P)
			</button>
		{/if}
		{#if currSlide < slides.length - 1}
			<button on:click={() => dispatch('end-tutorial')}
				>Skip tutorial (T)</button
			>
		{/if}
		<button
			class:has-arrow={currSlide < slides.length - 1}
			class="flipped"
			on:click={nextSlide}
			bind:this={continueButton}
			>{currSlide < slides.length - 1 ? '(C)' : "I'm ready! (C)"}</button
		>
	</div>
</div>

<style>
	#tutorial {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 1rem;
		padding: 2rem;
	}

	button {
		color: var(--color-text);
		border: none;
		border-radius: 2px;
		transition: none 0.18s ease-in-out;
		transition-property: background-color, border-radius;
	}

	button:hover {
		background-color: var(--color-text-light);
		border-radius: 0;
	}

	button:focus:not(button:hover) {
		color: var(--color-text-light);
	}

	#tutorial-navigation-buttons {
		display: flex;
		gap: 1rem;
		margin-top: 2rem;
	}

	.has-arrow:not(.flipped):before,
	.has-arrow:is(.flipped):after {
		content: url('../../../assets/left-arrow.svg');
	}

	.has-arrow:not(.flipped):before {
		margin-right: 4px;
	}

	.has-arrow:is(.flipped):after {
		margin-left: 4px;
		display: inline-block;
		transform: rotate(180deg);
	}

	.has-arrow:focus:not(button:hover):before,
	.has-arrow:focus:not(button:hover):after {
		filter: invert(1);
	}

	@media (min-width: 640px) {
		#tutorial-navigation-buttons {
			gap: 2rem;
			font-size: 1.25rem;
		}
	}
</style>
