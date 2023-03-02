<script lang="ts">
	import { createEventDispatcher } from 'svelte'
	import { fade } from 'svelte/transition'
	import { createQuery } from '@tanstack/svelte-query'
	import { getWins } from '../data'
	import { formatDate } from '../utils/formatDate'
	import { formatSeconds } from '../utils/formatSeconds'
	import type { Difficulty } from '../types'

	const dispatch = createEventDispatcher()

	const query = createQuery({
		queryKey: ['scores'],
		queryFn: async () => await getWins(),
		refetchInterval: 1000 * 300,
	})

	type Score = {
		name: string
		date: string
		difficulty: Difficulty
		duration: string
		errors: number
		score: number
	}

	$: scores = $query.isSuccess
		? $query.data.slice(0, 10).map((score: Score) => beautifyScore(score))
		: []
	$: error = $query.isError ? `Error: ${$query.error}` : undefined

	function beautifyScore(score: Score) {
		score.date = formatDate(new Date(score.date))
		score.duration = formatSeconds(+score.duration)
		score.difficulty = score.difficulty
			.split(' ')
			.map((s) => s.charAt(0).toUpperCase() + s.substring(1))
			.join(' ') as Difficulty
		return score
	}
</script>

<div id="highscores">
	{#if $query.isLoading}
		<div class="spinner" />
	{:else if error}
		<p class="error">{error}</p>
	{:else if $query.isSuccess}
		<table>
			<thead>
				<tr>
					<th />
					<th>Name</th>
					<th>Date</th>
					<th>Difficulty</th>
					<th>Time</th>
					<th>Errors</th>
					<th>Score</th>
				</tr>
			</thead>
			<tbody>
				{#each scores as score, index}
					<tr>
						<th>{index + 1}.</th>
						<td>{score.name}</td>
						<td>{score.date}</td>
						<td>{score.difficulty}</td>
						<td>{score.duration}</td>
						<td>{score.errors}</td>
						<td>{score.score}</td>
					</tr>
				{/each}
			</tbody>
		</table>

		<button on:click={() => dispatch('close-highscores')}>Close</button>

		{#if $query.isFetching}
			<div out:fade class="spinner mini-spinner" />
		{/if}
	{/if}
</div>

<style>
	#highscores {
		position: absolute;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 2rem;
		height: 100%;
		width: 100%;
	}
	table {
		table-layout: fixed;
		border-collapse: collapse;
		text-align: center;
		width: 100%;
		min-width: min(50%, 800px);
		max-width: min(90%, 1250px);
	}
	th {
		color: var(--color-text-light);
	}
	tr:nth-child(even) {
		background-color: var(--color-text-light);
	}
	tbody tr:nth-child(even) th {
		color: var(--color-text);
	}
	tr:nth-child(odd) td {
		color: var(--color-text-light);
	}
	.spinner {
		width: 100px;
		height: 100px;
		background-image: url('src/assets/loading.svg');
		background-position: center;
	}
	.mini-spinner {
		position: absolute;
		top: 0;
		right: 0;
		transform: scale(0.25);
	}
	.error {
		color: hsl(15, 100%, 50%);
	}
</style>
