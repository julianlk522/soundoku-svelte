<script lang="ts">
	import { onMount } from 'svelte'
	import { createEventDispatcher } from 'svelte'
	import type { Difficulty } from '../types'
	import { difficulties } from '../types'

	const dispatch = createEventDispatcher()

	let deviceType: 'mobile' | 'tablet' | 'desktop' = 'mobile'
	$: canUseHoverAnimations = deviceType === 'desktop'
	let currentlyHovered: Difficulty | undefined = undefined

	function handleDifficultySelect(event: MouseEvent) {
		const targetButton = event.target as HTMLButtonElement
		dispatch('difficulty-select', targetButton.innerText)
	}

	function setCurrentlyHovered(difficultyLevel: Difficulty | undefined) {
		if (!canUseHoverAnimations) return
		currentlyHovered = difficultyLevel
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
					{!canUseHoverAnimations ||
					currentlyHovered === difficultyLevel
						? difficultyLevel
						: ''}</span
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
		height: 100%;
		width: 100%;
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
		color: var(--color-text);
		border: none;
		border-radius: 4px;
	}

	button:focus {
		outline: none;
	}

	button:is(.can-use-hover-animations) {
		height: 2rem;
		width: 2rem;
		border-radius: 100%;
		transition: none 0.5s cubic-bezier(0.16, 1, 0.3, 1);
		transition-property: height, width, border-radius;
	}

	button:not(.can-use-hover-animations) {
		padding: 0.5rem;
		font-size: 0.875rem;
		width: 5rem;
	}

	button:is(.hovered) {
		width: 6rem;
		border-radius: 4px;
	}

	span:is(.can-use-hover-animations) {
		display: inline-block;
		opacity: 0;
		transform: translateY(-5px);
		transition-duration: 0.75s, 0.5s;
		transition-delay: 0.15s;
		transition-timing-function: ease-out;
		transition-property: opacity, transform;
	}

	span:is(.button-text-hovered) {
		opacity: 1;
		transform: translateY(0);
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

	@media (min-width: 640px) {
		h2 {
			font-size: 2rem;
		}

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
