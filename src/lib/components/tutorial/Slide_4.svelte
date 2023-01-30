<script lang="ts">
	import MockBox from './MockBox.svelte'
	import MockNumberSelect from './MockNumberSelect.svelte'
</script>

<h2>Making Progress</h2>
<h3>
	You will also have access to the number selection grid, which can help you
	in two ways.
</h3>

<h3>
	1) Clicking one of the numbered buttons in the grid will play its
	corresponding tone, which you can use to identify the values of filled
	cells.
</h3>

<MockNumberSelect />

<style>
	h2,
	h3 {
		margin-bottom: 1rem;
		color: var(--color-text-light);
	}
</style>
