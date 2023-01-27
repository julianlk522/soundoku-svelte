<script lang="ts">
	import MockBox from './MockBox.svelte'
</script>

<h2>Slide 3</h2>
<h3>Hooray</h3>

<MockBox randomlyFilled={true} />

<style>
	h2,
	h3 {
		margin-bottom: 1rem;
		color: var(--color-text-light);
	}
</style>
