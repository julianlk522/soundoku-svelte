<script lang="ts">
	export let value: number
	export let active: boolean
	export let cycles: number
	$: cellHueSecondary = active && cycles && Math.floor(cycles / 2) % 2 === 0
	$: cellHueTertiary = active && cycles && Math.floor(cycles / 2) % 3 === 0
</script>

<button
	class="cell"
	class:active
	class:cell-hue-secondary={cellHueSecondary}
	class:cell-hue-tertiary={cellHueTertiary}
>
	{value}
</button>

<style>
	.cell {
		height: clamp(1.75rem, 5vmax, 4rem);
		width: clamp(1.75rem, 5vmax, 4rem);
		background-color: #eee;
		font-size: 1.5rem;
		font-weight: 700;
		border: 1px solid #aaa;
	}

	.active {
		background-color: var(--color-primary-soft);
		color: var(--color-text-light);
	}

	.cell-hue-secondary {
		background-color: var(--color-accent-muted);
	}

	.cell-hue-tertiary {
		background-color: var(--color-secondary-soft);
		color: var(--color-text);
	}

	@media (min-width: 640px) {
		.cell {
			font-size: 1.5rem;
		}
	}
</style>
