<script lang="ts">
	import MockBox from './MockBox.svelte'
</script>

<h2>Getting Around</h2>
<h3>
	You can navigate the cells on the board using the arrows keys, WASD, or by
	clicking each cell you wish to select.
</h3>

<MockBox randomlyFilled={true} selectableCells={true} />

<style>
	h2,
	h3 {
		margin-bottom: 1rem;
		color: var(--color-text-light);
	}
</style>
