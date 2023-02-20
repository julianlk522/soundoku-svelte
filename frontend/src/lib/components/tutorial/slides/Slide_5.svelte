<script lang="ts">
	import { tutorialErrorsStore } from '../../../../stores'
	import MockBox from '../MockBox.svelte'
	import MockNumberSelect from '../MockNumberSelect.svelte'
</script>

<h2>Making Progress (continued)</h2>

<h3>
	2) Clicking one of the buttons while an unfilled cell is selected will make
	a guess about that cell's value.
</h3>

<MockBox
	randomlyFilled={true}
	selectableCells={true}
	guessable={true}
	on:play-audio
/>
<MockNumberSelect on:play-audio />
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
