<script lang="ts">
	import Cell from './Cell.svelte'

	export let row: (number | undefined)[] = []
	export let rowIndex = 0
	export let completedCells: Set<number>
</script>

<div class="row">
	{#each row as value, i}
		<Cell {value} {row} {rowIndex} indexInRow={i} {completedCells} on:select />
	{/each}
</div>

<style>
	.row {
		display: flex;
		justify-content: space-between;
	}
</style>
