<script lang="ts">
	import { onMount, onDestroy } from 'svelte'
	import { selectedCellStore, selectedNumberStore } from './stores'
	import Board from '../components/Board.svelte'
	import NumberSelect from '../components/NumberSelect.svelte'
	import GameOverPopup from '../components/GameOverPopup.svelte'
	import Tutorial from '../components/tutorial/Tutorial.svelte'
	import { keys } from '../components/utils/keyboardNavigation'

	let tutorial = true
	let time = 0
	let errors = 0
	let timer: NodeJS.Timeout
	let gameOver = false
	let gameReset = false

	function handleNewGame() {
		time = 0
		timer = setInterval(() => time++, 1000)
		errors = 0
		gameOver = false
		gameReset = true
		setTimeout(() => (gameReset = false), 0)
	}

	function handleWin() {
		clearInterval(timer)
		gameOver = true
	}

	function formatSeconds(totalSeconds: number) {
		const minutes = Math.floor(totalSeconds / 60)
		const remainder = totalSeconds % 60
		const seconds = remainder < 10 ? '0' + remainder : remainder

		return `${minutes}: ${seconds}`
	}

	function handleKeydown(event: KeyboardEvent) {
		if (keys.hasOwnProperty(event.key)) {
			if ($selectedCellStore === null) {
				selectedCellStore.set(0)
			} else {
				selectedNumberStore.set(null)
				navigateCells(event.key)
			}
		}
	}

	function navigateCells(key: string) {
		//	left edge
		if (keys[key] === -1 && $selectedCellStore! % 9 === 0) {
			return selectedCellStore.update((cell) => cell! + 8)
		}
		//	right edge
		else if (keys[key] === 1 && $selectedCellStore! % 9 === 8) {
			return selectedCellStore.update((cell) => cell! - 8)
		}
		//	top edge
		else if (
			keys[key] === -9 &&
			Math.floor($selectedCellStore! / 9) === 0
		) {
			return selectedCellStore.update((cell) => cell! + 81 + keys[key])
		}
		//	bottom edge
		else if (keys[key] === 9 && Math.floor($selectedCellStore! / 9) === 8) {
			return selectedCellStore.update((cell) => cell! - 81 + keys[key])
		}
		//	not at an edge
		else {
			return selectedCellStore.update((cell) => cell! + keys[key])
		}
	}

	onMount(() => {
		clearInterval(timer)
		time = 0
	})

	onDestroy(() => clearInterval(timer))
</script>

<svelte:window on:keydown={handleKeydown} />

{#if !tutorial && !gameReset}
	<main class:game-over-fadeout={gameOver}>
		<div class="leavesBg" />
		<Board on:incorrect-guess={() => errors++} on:win={handleWin} />
		<NumberSelect time={formatSeconds(time)} {errors} />
	</main>
{/if}

{#if gameOver}
	<GameOverPopup
		victoryTime={formatSeconds(time)}
		{errors}
		on:new-game={handleNewGame}
	/>
{/if}

{#if tutorial}
	<Tutorial
		on:end-tutorial={() => {
			tutorial = false
			timer = setInterval(() => time++, 1000)
		}}
	/>
{/if}

<style>
	main {
		position: relative;
		height: 100%;
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		background-image: linear-gradient(
			200deg,
			hsl(240deg, 100%, 35%, 95%) -5%,
			hsl(224deg, 95%, 41%, 80%) 0%,
			hsl(218deg, 90%, 43%, 65%) 8%,
			hsl(213deg, 85%, 44%, 50%) 24%,
			hsl(207deg, 80%, 43%, 35%) 45%,
			hsl(200deg, 75%, 40%, 20%) 62%,
			hsl(192deg, 70%, 36%, 15%) 75%,
			hsl(181deg, 65%, 32%, 10%) 85%,
			hsl(171deg, 60%, 34%, 5%) 93%,
			hsl(164deg, 55%, 36%, 0%) 100%
		);
	}

	.leavesBg {
		height: 35%;
		width: 100%;
		background-image: url('assets/leavesBg.svg');
		position: absolute;
		z-index: -1;
		opacity: 50%;
	}

	.game-over-fadeout {
		opacity: 0.1;
		filter: blur(8px);
	}

	@media (min-width: 640px) {
		.leavesBg {
			top: 0;
		}
	}

	@media (min-width: 896px) {
		main {
			flex-direction: row;
			justify-content: space-evenly;
		}

		.leavesBg {
			height: 20%;
			top: initial;
			bottom: 0;
		}
	}
</style>
