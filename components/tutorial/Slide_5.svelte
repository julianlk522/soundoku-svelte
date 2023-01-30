<script lang="ts">
	import { tutorialErrorsStore } from '../../src/stores'
	import MockBox from './MockBox.svelte'
	import MockNumberSelect from './MockNumberSelect.svelte'
</script>

<h2>Making Progress (continued)</h2>

<h3>
	2) Clicking one of the buttons while an unfilled cell is selected will make
	a guess about that cell's value.
</h3>

<p>
	If you are right, the cell will change to a green shade and reveal its value
	permanently.
</p>

<p>
	Otherwise, the cell will temporarily change to a red shade and your total
	error count will be incremented.
</p>

<MockBox randomlyFilled={true} selectableCells={true} guessable={true} />
<MockNumberSelect />
<p>Errors: {$tutorialErrorsStore}</p>

<style>
	p,
	h2,
	h3 {
		color: var(--color-text-light);
	}

	h2,
	h3 {
		margin-bottom: 1rem;
	}
</style>
