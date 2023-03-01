<script lang="ts">
	import { onMount, createEventDispatcher } from 'svelte'
	import { getWins } from '../data'
	import { formatDate } from '../utils/formatDate'
	import type { Difficulty } from '../types'
	import { formatSeconds } from '../utils/formatSeconds'

	const dispatch = createEventDispatcher()

	type Score = {
		name: string
		date: string
		difficulty: Difficulty
		duration: string
		errors: number
		score: number
	}
	export let scores: Score[] = []
	let loading = true
	let message = ''

	function beautifyScore(score: Score) {
		score.date = formatDate(new Date(score.date))
		score.duration = formatSeconds(+score.duration)
		score.difficulty = score.difficulty
			.split(' ')
			.map((s) => s.charAt(0).toUpperCase() + s.substring(1))
			.join(' ') as Difficulty
	}

	onMount(async () => {
		const response = await getWins()

		if (response.error) {
			return (message = response.error)
		}
		console.log(response)
		scores = response.slice(0, 10)
		scores.forEach(beautifyScore)
		loading = false
	})
</script>

<div id="highscores">
	{#if loading}
		<div class="spinner" />
	{:else}
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
		min-width: 800px;
		max-width: 1250px;
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
</style>
