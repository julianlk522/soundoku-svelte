<script lang="ts">
    import {onMount, onDestroy} from 'svelte'
    import Board from '../components/Board.svelte'
	import NumberSelect from "../components/NumberSelect.svelte"
    import GameOverPopup from '../components/GameOverPopup.svelte';

    let time = 0
    let errors = 0
    let timer: NodeJS.Timeout
    let gameOver = false
    let gameReset = false

    function formatSeconds(totalSeconds: number) {
        const minutes = Math.floor(totalSeconds / 60);
        const remainder = totalSeconds % 60;
        const seconds = remainder < 10 ? '0' + remainder : remainder;

        return `${minutes}: ${seconds}`;
    }

    function handleWin() {
        clearInterval(timer)
        gameOver = true
    }

    function handleNewGame() {
        time = 0
        timer = setInterval(() => time++, 1000)
        errors = 0
        gameOver = false
        gameReset = true
        setTimeout(() => gameReset = false, 0)
    }

    onMount(() => {
        clearInterval(timer)
        time = 0
        timer = setInterval(() => time++, 1000)
    })

    onDestroy(() => clearInterval(timer))
</script>

{#if !gameReset}
<main
    class:game-over-fadeout={gameOver}
>
    <Board
    on:incorrect-guess={() => errors++}
    on:win={handleWin}
    />
    <NumberSelect
        time={formatSeconds(time)}
        {errors}
    />
</main>
{/if}

{#if gameOver}
    <GameOverPopup
        victoryTime={formatSeconds(time)}
        {errors}
        on:new-game={handleNewGame}
    />
{/if}

<style>
    main {
        position: relative;
        height: 100%;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1;
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

    .game-over-fadeout {
        opacity: 0.1;
        filter: blur(8px);
    }

    @media (min-width: 896px) {
        main {
            flex-direction: row;
            justify-content: space-evenly;
        }
    }

    /* .svgBgWrapper {
        height: 20%;
        top: initial;
        bottom: 0;
        opacity: 20%;
    } */
</style>