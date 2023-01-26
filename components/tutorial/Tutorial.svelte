<script lang="ts">
	import { createEventDispatcher } from 'svelte'
	import Slide_1 from './Slide_1.svelte'
	import Slide_2 from './Slide_2.svelte'
	const dispatch = createEventDispatcher()

	let currSlide: number = 0
	const slides = [Slide_1, Slide_2]

	function nextSlide() {
		if (currSlide < slides.length - 1) currSlide++
		else dispatch('end-tutorial')
	}
</script>

<div id="tutorial">
	<svelte:component this={slides[currSlide]} />

	<div id="tutorial-navigation-buttons">
		<button on:click={nextSlide}
			>{currSlide < slides.length - 1 ? 'Continue' : "I'm ready"}</button
		>
		{#if currSlide < slides.length - 1}
			<button on:click={() => dispatch('end-tutorial')}
				>Skip tutorial</button
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
</style>
