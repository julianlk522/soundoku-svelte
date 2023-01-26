<script lang="ts">
	import { sineIn } from 'svelte/easing'
	import { fade } from 'svelte/transition'
	import { topLeftToBottomRightStagger } from '../utils/topLeftToBottomRightStagger'
	export let value: number
	export let active: boolean = false
	export let cycles: number = 0
	$: cellHueSecondary = active && cycles && Math.floor(cycles / 2) % 2 === 0
	$: cellHueTertiary = active && cycles && Math.floor(cycles / 2) % 3 === 0
</script>

{#key Math.floor(cycles / 2)}
	<button
		class="cell"
		class:cell-hue-secondary={active}
		class:cell-hue-tertiary={cellHueSecondary}
		class:cell-hue-quaternary={cellHueTertiary}
		in:fade={{
			duration: 200,
			easing: sineIn,
			delay: 50 + 10 * topLeftToBottomRightStagger(value - 1, 3),
		}}
	>
		{value}
	</button>
{/key}

<style>
	.cell {
		height: clamp(1.75rem, 5vmax, 4rem);
		width: clamp(1.75rem, 5vmax, 4rem);
		background-color: #eee;
		font-size: 1.5rem;
		font-weight: 700;
		border: 1px solid #aaa;
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
