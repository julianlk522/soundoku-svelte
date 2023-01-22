<script lang='ts'>
    import {selectedCellStore} from '../src/stores'
    import {createEventDispatcher} from 'svelte'
    const dispatch = createEventDispatcher()

    // let completed = false
    export let value: number | null = 0
    export let rowIndex = 0
    export let indexInRow = 0

    let selectedCell: number | null
    selectedCellStore.subscribe(index => selectedCell = index)

    $: selected = selectedCell === rowIndex * 9 + indexInRow
    $: rightEdgeOfLocalBox = indexInRow === 2 || indexInRow === 5

    function handleSelect() {
      dispatch('select', {
        val: rowIndex * 9 + indexInRow
      })
    }
</script>

<button
    class="cell"
    class:selected={selected}
    class:rightEdgeOfLocalBox={rightEdgeOfLocalBox}
    on:click={handleSelect}
>
    <!-- {completed ? value : ""} -->
    {value !== null ? value : ""}
</button>

<style>
.cell {
  height: calc(70vw / 9);
  width: calc(70vw / 9);
  display: flex;
  justify-content: center;
  align-items: center;
  background: #eee;
  font-weight: 700;
  border: 2px solid #bbb;
}

@media (min-width: 640px) {
  .cell {
    height: min(calc(60vw / 9), 75px);
    width: min(calc(60vw / 9), 75px);
    font-size: 1.5rem;
  }
}

@media (min-width: 896px) {
  .cell {
    height: min(calc(45vw / 9), 75px);
    width: min(calc(45vw / 9), 75px);
  }
}

.completed {
    background-color: car(--color-secondary);
}

.selected {
    background-color: var(--color-primary);
}

.selected .empty {
    background-color: var(--color-primary-soft);
}

.rightEdgeOfLocalBox {
    border-right: 4px solid black;
}

</style>