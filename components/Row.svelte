<script lang="ts">
	import Cell from './Cell.svelte'
	import { createEventDispatcher } from 'svelte'
	const dispatch = createEventDispatcher()

	export let row: (number | null)[] = []
	export let rowIndex = 0
	export let completedCells: Set<number>

	function handleCellSelect(event: CustomEvent) {
		dispatch('select', event.detail)
	}
</script>

<div class="row">
	{#each row as value, i}
		<Cell
			{value}
			{rowIndex}
			indexInRow={i}
			{completedCells}
			on:select={handleCellSelect}
		/>
	{/each}
</div>

<style>
	.row {
		display: flex;
		justify-content: space-between;
	}
</style>
