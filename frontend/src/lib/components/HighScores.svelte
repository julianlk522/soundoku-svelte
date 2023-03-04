<script lang="ts">
	import { createEventDispatcher } from 'svelte'
	import { fade } from 'svelte/transition'
	import { createQuery } from '@tanstack/svelte-query'
	import { getWins } from '../data'
	import { formatDate } from '../utils/formatDate'
	import { formatSeconds } from '../utils/formatSeconds'
	import type { Difficulty } from '../types'

	const dispatch = createEventDispatcher()

	type Score = {
		name: string
		date: string
		difficulty: Difficulty
		duration: string
		errors: number
		score: number
	}

	async function getWinsWithPageParam(pageParam = 0) {
		let response = await getWins(pageParam)
		response.map((score: Score) => beautifyScore(score))
		return response
	}

	let page = 0
	$: start = page * 10

	$: query = createQuery({
		queryKey: ['scores', page],
		queryFn: async () => await getWinsWithPageParam(start),
		keepPreviousData: true,
		//	5 minutes
		refetchInterval: 1000 * 60,
	})

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
	{#if $query.isLoading || $query.isFetching}
		<div out:fade class="spinner" />
	{/if}
	{#if error}
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
				{#each $query.data as score, index}
					<tr>
						<th>{index + 1 + start}.</th>
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

		<div id="scores-actions">
			<button
				on:click={() => page--}
				disabled={!page || $query.isFetching}>{'<='}</button
			>
			<button on:click={() => dispatch('close-highscores')}>Close</button>
			<button
				on:click={() => page++}
				disabled={$query.data.length < 10 || $query.isFetching}
				>{'=>'}</button
			>
		</div>
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
		position: absolute;
		top: 2rem;
		right: 2rem;
		width: 25px;
		height: 25px;
		background-image: url('src/assets/loading.svg');
		background-position: center;
	}
	.error {
		color: hsl(15, 100%, 50%);
	}
</style>
