<script lang="ts">
	import { onMount } from 'svelte'
	import { getUserScore } from '../data'

	const userData = JSON.parse(localStorage.getItem('user') ?? '')
	let name = userData.name ? userData.name : 'unknown user'
	const token = userData.token ? userData.token : undefined
	let total_score = 0

	onMount(async () => {
		const response = await getUserScore({ name, token })

		if (response.error) {
			return (name += ' (not authenticated)')
		}

		total_score = response
	})
</script>

<p>
	{name}
	<span class="placeholder">|</span>
	{total_score}
</p>

<style>
	* {
		color: var(--color-text-light);
	}
	p {
		display: inline-block;
		position: absolute;
		bottom: 2rem;
		right: 2rem;
		padding: 2px 8px;
		border-radius: 4px;
		background-color: var(--color-accent-soft);
		outline: 1px solid rgb(255 255 255 / 0.1);
	}
	.placeholder {
		padding: 0 1rem;
	}
</style>
