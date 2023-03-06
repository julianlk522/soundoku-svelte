<script lang="ts">
	import { onMount, createEventDispatcher } from 'svelte'
	import { lastWinScoreStore, loggedInUserStore } from '../../stores'
	import { QueryClientProvider, QueryClient } from '@tanstack/svelte-query'
	import HighScores from './HighScores.svelte'
	import { submitWin } from '../data'
	import type { Difficulty, UserWinData } from '../types'

	const dispatch = createEventDispatcher()
	const queryClient = new QueryClient()

	let loading = false
	let message = ''
	let submitted = false
	let scoresShown = false

	export let victoryTime = '0: 00'
	let time = 60 * +victoryTime.split(':')[0] + +victoryTime.split(':')[1]
	export let errors = 0
	export let difficulty: Difficulty = 'Very Easy'

	let replayButton: HTMLButtonElement

	async function handleSubmit() {
		loading = true
		const { name, token } = $loggedInUserStore
		if (!name)
			return (message = 'Unable to submit: could not determine user name')
		if (!token)
			return (message =
				'Unable to submit: could not determine bearer token')

		const data: UserWinData = {
			name,
			token,
			difficulty,
			duration: time,
			errors,
		}
		const response = await submitWin(data)
		loading = false

		if (response.error) {
			return (message = response.error)
		}

		if (!response.score) {
			return (message = 'Error: could not resolve your score')
		}

		submitted = true
		lastWinScoreStore.set(response.score)
		loggedInUserStore.update((user) => ({
			...user,
			total_score: user.total_score + response.score,
		}))
	}

	onMount(() => replayButton.focus())
</script>

<div id="game-over" class:hidden={scoresShown}>
	<h2 id="congratulations">Congratulations, you won!</h2>
	<h3 id="victory-flex">💪</h3>
	<h3>
		Your time was:
		<span id="victory-time">
			{victoryTime}
		</span>
	</h3>
	<p id="errors">(with {errors} errors)</p>
	<div id="action-buttons">
		<button
			class="action-button"
			bind:this={replayButton}
			on:click={() => dispatch('new-game')}
		>
			Play Again?
		</button>
		<button
			class="action-button"
			disabled={submitted || !$loggedInUserStore.name}
			on:click|once={handleSubmit}
		>
			Submit Score?
		</button>
		<button
			class="action-button"
			on:click={() => {
				scoresShown = true
				message = ''
			}}
		>
			View Highscores?
		</button>
	</div>
	<p class='message'>{message}</p>
</div>

<QueryClientProvider client={queryClient}>
	{#if scoresShown}
		<HighScores on:close-highscores={() => (scoresShown = false)} />
	{/if}
</QueryClientProvider>

<style>
	#game-over {
		position: absolute;
		inset: 0;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		text-align: center;
		font-size: 1.5rem;
		padding: 2rem;
		z-index: 1;
	}

	#game-over * {
		color: var(--color-text-light);
	}

	#game-over:is(.hidden) {
		display: none;
	}

	#congratulations {
		font-size: 2rem;
		color: var(--color-primary);
		text-shadow: 0px 0px 2px var(--color-text-light);
	}

	#victory-time {
		font-weight: 700;
		color: var(--color-accent);
		text-shadow: 1px 1px 0px rgb(255 255 255 / 25%);
	}

	#victory-flex {
		font-size: 4rem;
		margin: 1rem 0;
	}

	#action-buttons {
		display: flex;
		justify-content: space-between;
		gap: 2rem;
		margin-top: 2rem;
	}

	.action-button {
		color: white;
		padding: 0.5rem 1rem;
		border: none;
		border-radius: 0.25rem;
		box-shadow: 0px 0px 4px rgb(0 0 0 / 25%);
		text-shadow: 1px 1px 0px var(--color-primary);
		background-image: linear-gradient(
			45deg,
			hsl(240deg 100% 35%) 0%,
			hsl(232deg 100% 35%) 0%,
			hsl(223deg 100% 35%) 4%,
			hsl(215deg 100% 35%) 12%,
			hsl(206deg 100% 35%) 26%,
			hsl(198deg 100% 36%) 45%,
			hsl(189deg 100% 36%) 66%,
			hsl(181deg 100% 36%) 83%,
			hsl(172deg 100% 36%) 94%,
			hsl(164deg 100% 36%) 100%
		);
		transition: none 0.18s ease-in-out;
		transition-property: transform;
	}
	.action-button:disabled {
		filter: grayscale(1);
		opacity: 0.25;
		transition: all 0.5s ease-out;
	}

	.action-button:not(:disabled):hover,
	.action-button:not(:disabled):focus {
		transform: scale(1.1);
	}

	.action-button:focus {
		outline: 2px solid var(--color-text-light);
	}

	.action-button:not(:disabled):active {
		transform: scale(0.95);
	}
	.message {
		margin-top: 2rem;
	}

	@media (min-width: 640px) {
		#game-over {
			padding: 4rem;
		}

		#congratulations {
			font-size: 3rem;
		}

		#victory-flex {
			margin: 2rem 0;
		}

		h3:has(#victory-time),
		#errors,
		#action-buttons {
			font-size: 2rem;
		}

		#action-buttons {
			margin-top: 4rem;
		}

		@media (min-width: 896px) {
			#congratulations {
				font-size: 4rem;
			}
		}
	}
</style>
