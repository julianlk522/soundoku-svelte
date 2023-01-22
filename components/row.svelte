<script lang='ts'>
    import Cell from "./Cell.svelte";
    import {createEventDispatcher} from 'svelte'
    const dispatch = createEventDispatcher()

    export let row: (number | null)[] = []
    export let rowIndex = 0
    $: bottomEdgeOfLocalBox = rowIndex === 2 || rowIndex === 5
    // let startingBoard

    function handleCellSelect(event: CustomEvent) {
        dispatch('select', {
            val: event.detail.val
        })
    }
</script>

<div class="row" class:bottomEdgeOfLocalBox>
    {#each row as value, i}
    <Cell
        {value}
        {rowIndex}
        indexInRow = {i}
        on:select={handleCellSelect}
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
