<script lang="ts">
	import { onMount } from 'svelte'
	import { fade, fly } from 'svelte/transition'
	import { lastWinScoreStore, loggedInUserStore } from '../../stores'
	import { getUserScore } from '../data'

	let name = $loggedInUserStore.name
		? $loggedInUserStore.name
		: 'unknown user'
	const token = $loggedInUserStore.token
		? $loggedInUserStore.token
		: undefined
	let scoreIndicator = ''
	$: $lastWinScoreStore && setScoreIndicator($lastWinScoreStore)

	function setScoreIndicator(score: number) {
		scoreIndicator = `😎 +${score}`
		setTimeout(() => {
			lastWinScoreStore.set(undefined)
			scoreIndicator = ''
		}, 2000)
	}

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

<p id="user-info">
	{name}
	<span class="placeholder">|</span>
	{$loggedInUserStore.total_score ?? 0}
</p>

{#if scoreIndicator}
	<span transition:fade>
		<p id="updated-score-indicator" in:fly={{ y: 10 }} out:fly={{ y: -20 }}>
			{scoreIndicator}
		</p>
	</span>
{/if}

<style>
	* {
		color: var(--color-text-light);
	}
	#user-info,
	#updated-score-indicator {
		display: inline-block;
		position: absolute;
	}
	#user-info {
		bottom: 2rem;
		right: 2rem;
		padding: 2px 8px;
		background-color: var(--color-accent-soft);
		outline: 1px solid rgb(255 255 255 / 0.1);
	}
	.placeholder {
		padding: 0 1rem;
	}
	#updated-score-indicator {
		color: var(--color-secondary);
		font-size: 0.75rem;
		bottom: 4rem;
		right: 3rem;
	}
</style>
