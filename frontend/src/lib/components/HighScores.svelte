<script lang="ts">
	import { createEventDispatcher } from 'svelte'
	import { fade } from 'svelte/transition'
	import { createQuery } from '@tanstack/svelte-query'
	import { getWins, getWinsByUser, getWinsPages } from '../data'
	import { formatDate } from '../utils/formatDate'
	import { formatSeconds } from '../utils/formatSeconds'
	import type { Difficulty, Score } from '../types'

	const dispatch = createEventDispatcher()

	async function getWinsWithPageParam(pageParam = 1) {
		let response = await getWins(pageParam)
		return response.map((score: Score) => beautifyScore(score))
	}

	let page = 1
	let sortMethod: 'wins' | 'users' = 'wins'

	$: winsQuery = createQuery({
		queryKey: ['wins', page],
		queryFn: async () => await getWinsWithPageParam(page),
		keepPreviousData: true,
		//	1 minute
		refetchInterval: 1000 * 60,
	})
	$: usersQuery = createQuery({
		queryKey: ['users'],
		queryFn: async () => await getWinsByUser(),
		keepPreviousData: true,
		//	1 minute
		refetchInterval: 1000 * 60,
	})
	$: currentQuery = sortMethod === 'wins' ? $winsQuery : $usersQuery

	$: error = currentQuery.isError ? `Error: ${currentQuery.error}` : undefined

	function beautifyScore(score: Score) {
		score.date = formatDate(new Date(score.date))
		score.duration = formatSeconds(+score.duration)
		score.difficulty = score.difficulty
			.split('_')
			.map((s) => s.charAt(0).toUpperCase() + s.substring(1))
			.join(' ') as Difficulty
		return score
	}
</script>

<div id="highscores">
	{#if currentQuery.isLoading || currentQuery.isFetching}
		<div out:fade class="spinner" />
	{/if}
	{#if error}
		<p class="error">{error}</p>
	{:else if currentQuery.isSuccess}
		<table>
			<thead>
				<tr>
					<th />
					<th>Name</th>
					{#if currentQuery === $winsQuery}
						<th>Date</th>
						<th>Difficulty</th>
						<th>Time</th>
						<th>Errors</th>
						<th>Score</th>
					{:else}
						<th>Total Score</th>
						<th>Games Played</th>
					{/if}
				</tr>
			</thead>
			<tbody>
				{#each currentQuery.data as score}
					<tr>
						<th>{score.row_num ?? 1}.</th>
						<td>{score.name}</td>
						{#if currentQuery === $winsQuery}
							<td>{score.date}</td>
							<td>{score.difficulty}</td>
							<td>{score.duration}</td>
							<td>{score.errors}</td>
							<td>{score.score}</td>
						{:else}
							<td>{score.total_score}</td>
							<td>{score.games_played}</td>
						{/if}
					</tr>
				{/each}
			</tbody>
		</table>

		<div id="scores-actions">
			<button
				on:click={() => (page = 1)}
				disabled={page === 1 || currentQuery.isFetching}>{'<=='}</button
			>
			<button
				on:click={() => page--}
				disabled={page === 1 || currentQuery.isFetching}>{'<='}</button
			>
			<button on:click={() => dispatch('close-highscores')}>Close</button>
			<button
				on:click={() => page++}
				disabled={currentQuery.data.length < 10 ||
					currentQuery.isFetching}>{'=>'}</button
			>
			<button
				on:click={async () => {
					const pagesResponse = await getWinsPages()
					page = pagesResponse
				}}
				disabled={currentQuery.data.length < 10 ||
					currentQuery.isFetching}>{'==>'}</button
			>
		</div>
		<button
			on:click={() => {
				currentQuery =
					currentQuery === $winsQuery ? $usersQuery : $winsQuery
			}}>Sort by {currentQuery === $winsQuery ? 'users' : 'wins'}</button
		>
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
	thead tr th {
		border-bottom: 2px solid var(--color-text-light);
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
	#scores-actions {
		display: flex;
		gap: 0.5rem;
	}
	.spinner {
		position: absolute;
		top: 2rem;
		right: 2rem;
		width: 25px;
		height: 25px;
		background-image: url('../../assets/loading.svg');
		background-position: center;
	}
	.error {
		color: hsl(15, 100%, 50%);
	}
</style>
