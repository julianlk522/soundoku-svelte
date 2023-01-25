<script>
	import { createEventDispatcher } from 'svelte'
	const dispatch = createEventDispatcher()
</script>

<div id="tutorial">
	<h2>Hey! Thanks for checking out Soundoku.</h2>
	<h3>
		This is a brief, optional interactive tutorial to walk you through how
		to play the game.
	</h3>
	<div id="buttons">
		<button>Continue</button>
		<button on:click={() => dispatch('skip-tutorial')}>Skip tutorial</button
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
	}

	#tutorial > * {
		color: var(--color-text-light);
	}

	#buttons {
		display: flex;
		justify-content: space-evenly;
		gap: 2rem;
		margin-top: 2rem;
	}
</style>
