<script lang="ts">
	import { onMount } from 'svelte'
	import { createEventDispatcher } from 'svelte'
	import type { Difficulty } from '../types'
	import { difficulties } from '../types'

	const dispatch = createEventDispatcher()

	let deviceType: 'mobile' | 'tablet' | 'desktop' = 'mobile'
	$: canUseHoverAnimations = deviceType === 'desktop'

	let currentlyHovered: Difficulty | undefined = undefined

	let buttonText: Difficulty | '' = ''

	function handleDifficultySelect(event: MouseEvent) {
		const targetButton = event.target as HTMLButtonElement
		dispatch('difficulty-select', targetButton.innerText)
	}

	function setCurrentlyHovered(difficultyLevel: Difficulty | undefined) {
		if (!canUseHoverAnimations) return
		currentlyHovered = difficultyLevel
		if (difficultyLevel) buttonText = difficultyLevel
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key !== 'Tab') return
		if (currentlyHovered === 'Very Hard') {
			if (event.shiftKey) return
			event.preventDefault()
			document.getElementById('very-easy')?.focus()
		}
	}

	//	Big thanks to https://abdessalam.dev/blog/detect-device-type-javascript/ for this function
	function getDeviceType() {
		const ua = navigator.userAgent
		if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
			return 'tablet'
		}
		if (
			/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
				ua
			)
		) {
			return 'mobile'
		}
		return 'desktop'
	}

	onMount(() => {
		deviceType = getDeviceType()
	})
</script>

<div id="difficulty-select-container">
	<div id="difficulty-select-header-text">
		<h2>Select your desired difficulty</h2>
		{#if canUseHoverAnimations}
			<p>
				(Hover the bubbles or navigate with Tab key to reveal available
				difficulties)
			</p>
		{/if}
	</div>

	<div id="button-container-grid">
		{#each difficulties as difficultyLevel (difficultyLevel)}
			<button
				id={difficultyLevel.toLowerCase().replace(' ', '-')}
				class:can-use-hover-animations={canUseHoverAnimations}
				class:hovered={canUseHoverAnimations &&
					currentlyHovered === difficultyLevel}
				on:click={handleDifficultySelect}
				on:keydown={handleKeydown}
				on:focus={() => setCurrentlyHovered(difficultyLevel)}
				on:mouseenter={() => setCurrentlyHovered(difficultyLevel)}
				on:mouseleave={() => setCurrentlyHovered(undefined)}
			>
				<span
					class="button-text"
					class:can-use-hover-animations={canUseHoverAnimations}
					class:button-text-hovered={canUseHoverAnimations &&
						currentlyHovered === difficultyLevel}
				>
					{canUseHoverAnimations
						? buttonText
							? difficultyLevel
							: buttonText
						: difficultyLevel}</span
				>
			</button>
		{/each}
	</div>
</div>

<style>
	* {
		--color-difficulty-very-easy: hsl(170deg, 70%, 50%);
		--color-difficulty-easy: hsl(110deg, 60%, 55%);
		--color-difficulty-medium: hsl(40deg, 70%, 50%);
		--color-difficulty-hard: hsl(20deg, 80%, 45%);
		--color-difficulty-very-hard: hsl(0, 90%, 40%);
	}

	#difficulty-select-container {
		display: flex;
		flex-direction: column;
		justify-content: space-evenly;
		align-items: center;
		text-align: center;
		height: 100%;
		width: 100%;
		padding: 0 2rem;
	}

	#difficulty-select-header-text {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	h2,
	p {
		color: var(--color-text-light);
	}

	h2 {
		margin-bottom: 1rem;
	}

	p {
		font-size: 0.75rem;
	}

	#button-container-grid {
		display: grid;
		height: 60%;
		width: 80%;
		place-items: center;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		grid-template-rows: repeat(3, minmax(0, 1fr));
		grid-template-areas:
			'very-easy . easy'
			'. medium .'
			'hard . very-hard';
	}

	button {
		position: relative;
		color: var(--color-text);
		border: none;
		border-radius: 4px;
		cursor: pointer;
	}

	button:focus {
		outline: none;
	}

	button:is(.can-use-hover-animations) {
		height: 2rem;
		width: 2rem;
		border-radius: 100%;
		transition: none 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.25s;
		transition-property: border-radius, height, width, transform;
	}

	button:not(.can-use-hover-animations) {
		padding: 0.5rem;
		font-size: 0.875rem;
		width: 5rem;
	}

	button:is(.hovered) {
		width: 6rem;
		border-radius: 4px;
		transform: scale(2);
		transition-duration: 0.35s;
		transition-delay: 0s, 0.1s, 0.1s, 0.1s;
	}

	span:is(.can-use-hover-animations) {
		display: inline-block;
		position: absolute;
		inset: 0;
		opacity: 0;
		transition: opacity 0.25s;
	}

	span:is(.button-text-hovered) {
		opacity: 1;
		transition-duration: 0.45s;
		transition-delay: 0.05s;
	}

	#very-easy {
		background-color: var(--color-difficulty-very-easy);
		grid-area: very-easy;
	}

	#easy {
		background-color: var(--color-difficulty-easy);
		grid-area: easy;
	}

	#medium {
		background-color: var(--color-difficulty-medium);
		grid-area: medium;
	}

	#hard {
		background-color: var(--color-difficulty-hard);
		grid-area: hard;
	}

	#very-hard {
		background-color: var(--color-difficulty-very-hard);
		grid-area: very-hard;
	}

	@media (min-width: 500px) {
		h2 {
			font-size: 2rem;
		}

		p {
			font-size: 1rem;
		}
	}

	@media (min-width: 640px) {
		button:is(.can-use-hover-animations),
		button:not(.can-use-hover-animations),
		.hovered {
			width: 8rem;
		}

		button:is(.can-use-hover-animations):not(.hovered) {
			height: 3rem;
			width: 3rem;
		}

		.button-text {
			font-size: 1.25rem;
		}
	}
</style>
