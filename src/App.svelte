<script lang="ts">
    import {onMount, onDestroy} from 'svelte'
    import Board from "../components/Board.svelte"
	import NumberSelect from "../components/NumberSelect.svelte"

    let time = 0
    let errors = 0
    let timer: NodeJS.Timeout

    function formatSeconds(totalSeconds: number) {
        const minutes = Math.floor(totalSeconds / 60);
        const remainder = totalSeconds % 60;
        const seconds = remainder < 10 ? '0' + remainder : remainder;

        return `${minutes}: ${seconds}`;
    }

    onMount(() => {
        clearInterval(timer)
        time = 0
        timer = setInterval(() => time++, 1000)
    })

    onDestroy(() => clearInterval(timer))
</script>

<main>
    <Board/>
    <NumberSelect time={formatSeconds(time)} {errors}/>
</main>

<style>
    main {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
</style>