<script lang="ts">
	import { onMount, onDestroy } from 'svelte'
	import {
		loggedInUserStore,
		selectedCellStore,
		selectedCellWithNavigationStore,
	} from './stores'
	import Board from './lib/components/Board.svelte'
	import NumberSelect from './lib/components/NumberSelect.svelte'
	import Tutorial from './lib/components/tutorial/Tutorial.svelte'
	import Auth from './lib/components/Auth.svelte'
	import UserInfo from './lib/components/UserInfo.svelte'
	import DifficultySelect from './lib/components/DifficultySelect.svelte'
	import type { DeviceType, Difficulty } from './lib/types'
	import GameOverPopup from './lib/components/GameOverPopup.svelte'
	import { formatSeconds } from './lib/utils/formatSeconds'
	import { playAudio, playArpeggio } from './lib/utils/audio'
	import { keys } from './lib/utils/keyboardNavigation'
	import { getDeviceType } from './lib/utils/getDeviceType'

	$: loggedIn = $loggedInUserStore.token !== undefined
	let playingLocally = false
	$: canProceedToDifficultySelect = loggedIn || playingLocally

	//	determines animations to be shown in DifficultySelect
	let deviceType: DeviceType = 'mobile'

	let tutorial = true

	let difficulty: Difficulty | undefined = undefined
	let time = 0
	let timer: NodeJS.Timeout
	let errors = 0

	let gameOver = false
	let gameReset = false

	function handleDifficultySelect(event: CustomEvent) {
		difficulty = event.detail
		timer = setInterval(() => time++, 1000)
	}

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
		playArpeggio()
		gameOver = true
	}

	function handleKeydown(event: KeyboardEvent) {
		if (!difficulty || gameOver) return
		if (/^[\d]+$/.test(event.key)) {
			selectedCellWithNavigationStore.set(false)
			playCellTone(parseInt(event.key) - 1)
		}
		if (keys.hasOwnProperty(event.key)) {
			if ($selectedCellStore === undefined) {
				selectedCellStore.set(0)
				return
			}
			navigateCells(event.key)
		}
	}

	function navigateCells(key: string) {
		selectedCellWithNavigationStore.set(true)
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

	function playCellTone(
		toneIndex: number,
		triggeredByNavigation: boolean = false,
		panning?: number
	) {
		if (toneIndex < 0) return
		if (panning) return playAudio(toneIndex, triggeredByNavigation, panning)
		playAudio(toneIndex, triggeredByNavigation)
	}

	onMount(() => {
		deviceType = getDeviceType()
		clearInterval(timer)
		time = 0
	})

	onDestroy(() => clearInterval(timer))
</script>

<svelte:window on:keydown={handleKeydown} />

<main>
	{#if !tutorial && difficulty && !gameReset}
		<div id="game-content" class:game-over-fadeout={gameOver}>
			<div class="leavesBg" />
			<Board
				{difficulty}
				on:play-audio={(event) =>
					playCellTone(
						event.detail.toneIndex,
						event.detail.triggeredByNavigation,
						event.detail.panning
					)}
				on:incorrect-guess={() => errors++}
				on:win={handleWin}
			/>
			<NumberSelect
				time={formatSeconds(time)}
				{errors}
				on:play-audio={(event) => playCellTone(event.detail)}
			/>
		</div>
	{/if}

	{#if tutorial}
		<Tutorial
			on:end-tutorial={() => {
				tutorial = false
			}}
			on:play-audio={(event) =>
				playCellTone(
					event.detail.toneIndex,
					event.detail.triggeredByNavigation,
					event.detail.panning
				)}
		/>
	{/if}

	{#if !tutorial && !difficulty && canProceedToDifficultySelect}
		<DifficultySelect
			{deviceType}
			on:difficulty-select={handleDifficultySelect}
		/>
	{/if}

	{#if !tutorial && !canProceedToDifficultySelect}
		<Auth on:enable-local-play={() => (playingLocally = true)} />
	{/if}

	{#if gameOver}
		<GameOverPopup
			victoryTime={formatSeconds(time)}
			{errors}
			{difficulty}
			on:new-game={handleNewGame}
		/>
	{/if}

	{#if loggedIn}
		<UserInfo />
	{/if}
</main>

<style>
	main {
		display: flex;
		justify-content: center;
		height: 100%;
		width: 100%;
	}
	#game-content {
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
		#game-content {
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
