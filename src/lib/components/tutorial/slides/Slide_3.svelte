<script lang="ts">
	import MockBox from '../MockBox.svelte'
</script>

<h2>Getting Around</h2>
<h3>
	You can navigate the cells on the board using the arrows keys, WASD, or by
	clicking each cell you wish to select.
</h3>

<MockBox randomlyFilled={true} selectableCells={true} />

<h3>
	Selecting a filled cell will play one of 9 tones; the tone you hear is
	determined by the cell's (hidden) value, with 1 being the lowest in pitch
	and 9 being the highest.
</h3>

<style>
	h2,
	h3 {
		margin-bottom: 1rem;
		color: var(--color-text-light);
	}
</style>
