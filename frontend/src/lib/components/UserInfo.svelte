<script lang="ts">
	import { onMount } from 'svelte'
	import { loggedInUserStore } from '../../stores'
	import { getUserScore } from '../data'

	let name = $loggedInUserStore.name
		? $loggedInUserStore.name
		: 'unknown user'
	const token = $loggedInUserStore.token
		? $loggedInUserStore.token
		: undefined

	onMount(async () => {
		if (!token) return
		const response = await getUserScore({ name, token })

		if (response.error) {
			return (name += ' (not authenticated)')
		}

		loggedInUserStore.update((store) => ({
			...store,
			total_score: response,
		}))
	})
</script>

<p>
	{name}
	<span class="placeholder">|</span>
	{$loggedInUserStore.total_score ?? 0}
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
		background-color: var(--color-accent-soft);
		outline: 1px solid rgb(255 255 255 / 0.1);
	}
	.placeholder {
		padding: 0 1rem;
	}
</style>
