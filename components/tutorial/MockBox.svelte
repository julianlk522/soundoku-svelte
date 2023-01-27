<script lang="ts">
	import MockCell from './MockCell.svelte'

	export let index: number | undefined = undefined
	export let cycles: number | undefined = undefined

	const cellsArray = Array.from(Array(9)).map((_, i) => i + 1)

	export let randomlyFilled: boolean = false
	$: randomlyFilledCells =
		randomlyFilled &&
		cellsArray.filter((val) => val > Math.floor(Math.random() + 0.5) * val)
</script>

<div id="cells-grid">
	{#each cellsArray as value, i (i)}
		<MockCell
			{value}
			active={Number.isInteger(index) ? i === index : undefined}
			cycles={cycles ? cycles : undefined}
			{randomlyFilledCells}
		/>
	{/each}
</div>

<style>
	#cells-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		margin: 2rem 0;
		background-color: #eee;
	}
</style>
