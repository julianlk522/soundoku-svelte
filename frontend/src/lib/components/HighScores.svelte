<script lang="ts">
	import { onMount } from 'svelte'
	import { getWins } from '../data'
	import { getFormattedDate } from '../utils/getFormattedDate'
	import type { Difficulty } from '../types'

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

	onMount(async () => {
		const response = await getWins()

		if (response.error) {
			return (message = response.error)
		}
		console.log(response)
		scores = response.slice(0, 10)
		scores.map(
			(score) => (score.date = getFormattedDate(new Date(score.date)))
		)
		loading = false
	})
</script>

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
{/if}

<style>
	table {
		position: absolute;
		table-layout: fixed;
		border-collapse: collapse;
		width: 100%;
		padding: 1rem;
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
		position: absolute;
		background-image: url('src/assets/loading.svg');
		background-position: center;
	}
</style>
