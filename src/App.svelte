<script lang="ts">
    import Board from "../components/Board.svelte"
	import NumberSelect from "../components/NumberSelect.svelte"
</script>

<main>
    <Board/>
    <NumberSelect />
</main>

<style>
    main {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
</style>