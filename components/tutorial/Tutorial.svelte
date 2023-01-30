<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte'
	import Slide_1 from './Slide_1.svelte'
	import Slide_2 from './Slide_2.svelte'
	import Slide_3 from './Slide_3.svelte'
	import Slide_4 from './Slide_4.svelte'
	import Slide_5 from './Slide_5.svelte'
	const dispatch = createEventDispatcher()

	let firstButton: HTMLButtonElement

	const slides = [Slide_1, Slide_2, Slide_3, Slide_4, Slide_5]
	let currSlide = 0

	function nextSlide() {
		if (currSlide < slides.length - 1) currSlide++
		else dispatch('end-tutorial')
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key.toLowerCase() === 't') {
			dispatch('end-tutorial')
		} else if (event.key.toLowerCase() === 'c') {
			nextSlide()
		}
	}

	onMount(() => firstButton.focus())
</script>

<div id="tutorial" on:keydown|stopPropagation={handleKeydown}>
	<svelte:component this={slides[currSlide]} />

	<div id="tutorial-navigation-buttons">
		<button on:click={nextSlide} bind:this={firstButton}
			>{currSlide < slides.length - 1
				? 'Continue (C)'
				: "I'm ready! (C)"}</button
		>
		{#if currSlide < slides.length - 1}
			<button on:click={() => dispatch('end-tutorial')}
				>Skip tutorial (T)</button
			>
		{/if}
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

	#tutorial-navigation-buttons {
		display: flex;
		justify-content: space-evenly;
		gap: 2rem;
		margin-top: 2rem;
	}

	#tutorial-navigation-buttons button {
		color: var(--color-text);
		border: none;
		border-radius: 2px;
		transition: none 0.18s ease-in-out;
		transition-property: background-color, border-radius;
	}

	#tutorial-navigation-buttons button:hover {
		background-color: var(--color-text-light);
		border-radius: 0;
	}

	#tutorial-navigation-buttons button:focus:not(button:hover) {
		color: var(--color-text-light);
	}
</style>
