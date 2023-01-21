<script lang='ts'>
    import Cell from "./cell.svelte";

    export let row: (number | null)[] = []
    export let rowIndex = 0
    $: bottomEdgeOfLocalBox = rowIndex === 2 || rowIndex === 5
    export let selectedCell: number | null = null
    // let startingBoard
</script>

<div class="row" class:bottomEdgeOfLocalBox>
    {#each row as value, i}
    <Cell
        {value}
        {selectedCell}
        {rowIndex}
        indexInRow = {i}
    />
    {/each}
</div>

<style>
.row {
    display: flex;
    justify-content: space-between;
}

.cell {
    display: flex;
    width: 100%;
    justify-content: center;
}
.bottomEdgeOfLocalBox {
    border-bottom: 4px solid black;
}
</style>
