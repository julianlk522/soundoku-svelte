<script lang="ts">
	import MockBox from './MockBox.svelte'
	import MockNumberSelect from './MockNumberSelect.svelte'
</script>

<h2>Making Progress (continued)</h2>

<h3>
	2) Clicking one of the buttons while an unfilled cell is selected will make
	a guess about that cell's value.
</h3>

<h3>
	If you are right, the cell will change to a green shade and reveal its value
	permanently. If you are wrong, the cell will temporarily change to a red
	shade and your total error count will be incremented.
</h3>

<MockBox randomlyFilled={true} selectableCells={true} guessable={true} />
<MockNumberSelect />

<style>
	h2,
	h3 {
		margin-bottom: 1rem;
		color: var(--color-text-light);
	}
</style>
