<script lang="ts">
	import { tutorialErrorsStore } from '../../src/stores'
	import MockBox from './MockBox.svelte'
</script>

<h2>Making Progress (continued)</h2>

<h3>You can also make guesses using the numbers on your keyboard.</h3>

<p>
	As you may have noticed, if you guess right then the cell will change to a
	<span class="green">green</span> shade and reveal its value permanently.
</p>

<p>
	Otherwise, the cell will temporarily change to a <span class="red">red</span
	> shade and your total error count will be incremented.
</p>

<MockBox randomlyFilled={true} selectableCells={true} guessable={true} />
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

	.green {
		color: var(--color-secondary-soft);
	}

	.red {
		color: var(--color-accent);
	}

	.green,
	.red {
		text-shadow: 1px 0px 0px rgb(255 255 255 / 25%);
	}
</style>
