<script lang="ts">
	import MockBox from './MockBox.svelte'
</script>

<h2>I see nothing! 🤔</h2>
<h3>
	That's right. When you first start the game you will not be able to see any
	cell values.
</h3>
<h3>
	You will be able to tell which cells are filled though based on the green
	icon present at the top-left of those cells.
</h3>

<MockBox randomlyFilled={true} flashFilled={true} />

<style>
	h2,
	h3 {
		margin-bottom: 1rem;
		color: var(--color-text-light);
	}
</style>
