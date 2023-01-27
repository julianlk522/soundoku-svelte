<script lang="ts">
	import { onMount } from 'svelte'
	import { sineIn } from 'svelte/easing'
	import { fade } from 'svelte/transition'
	import { topLeftToBottomRightStagger } from '../utils/topLeftToBottomRightStagger'

	let self: HTMLButtonElement

	export let value: number
	export let active: boolean = false
	export let cycles: number = 0
	$: cellHueSecondary = active && cycles && Math.floor(cycles / 2) % 2 === 0
	$: cellHueTertiary = active && cycles && Math.floor(cycles / 2) % 3 === 0
	export let randomlyFilledCells: number[] | undefined
	$: filled = randomlyFilledCells && randomlyFilledCells.indexOf(value) !== -1

	onMount(() => {
		if (!filled) return
		self.style.setProperty(
			'--flash-filled-delay',
			(randomlyFilledCells!.indexOf(value) / 2).toString()
		)
		self.style.setProperty(
			'--flash-filled-duration',
			(randomlyFilledCells!.length / 2).toString()
		)
	})
</script>

{#key Math.floor(cycles / 2)}
	<button
		class="cell"
		class:cell-hue-secondary={active}
		class:cell-hue-tertiary={cellHueSecondary}
		class:cell-hue-quaternary={cellHueTertiary}
		bind:this={self}
		in:fade={{
			duration: 200,
			easing: sineIn,
			delay: 50 + 10 * topLeftToBottomRightStagger(value - 1, 3),
		}}
	>
		{#if filled}
			<div class="filled" />
		{/if}
		{!randomlyFilledCells ? value : ''}
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
		pointer-events: none;
	}

	.filled {
		position: absolute;
		left: 4px;
		top: 4px;
		height: 8px;
		width: 8px;
		background-color: transparent;
		border-radius: 5px;
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

	@media (min-width: 640px) {
		.cell {
			font-size: 1.5rem;
		}
	}
</style>
