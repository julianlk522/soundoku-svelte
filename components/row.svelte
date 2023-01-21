<script>
    import Cell from "./cell.svelte";

    let row = Array.from(Array(10)).map((_, i) => i + 1)
    let rowIndex = 5
    $: bottomEdgeOfLocalBox = rowIndex === 2 || rowIndex === 5
    let selectedCell
    let startingBoard
</script>

<div class="row" class:bottomEdgeOfLocalBox>
    {#each row as cell}
    <Cell />
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
