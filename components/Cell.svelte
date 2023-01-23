<script lang='ts'>
    import {selectedCellStore, selectedNumberStore} from '../src/stores'
    import {createEventDispatcher} from 'svelte'
    const dispatch = createEventDispatcher()

    export let value: number | null = 0
    $: empty = value === null
    export let rowIndex = 0
    export let indexInRow = 0
    export let completedCells: Set<number>
    $: completed = value && completedCells.has(rowIndex * 9 + indexInRow)

    let selectedCell: number | null
    selectedCellStore.subscribe(index => selectedCell = index)

    $: selected = selectedCell === rowIndex * 9 + indexInRow
    $: rightEdgeOfLocalBox = indexInRow === 2 || indexInRow === 5

    function handleSelect() {
      dispatch('select', {index: rowIndex * 9 + indexInRow, value})
    }

    function handleKeydown(event: KeyboardEvent) {
      if (/\d/.test(event.key)) {
        selectedNumberStore.set(+event.key)
      }
    }
</script>

<button
    class="cell {selected ? empty ? 'selected-empty' : completed ? 'selected-completed' : '' : ''}"
    class:completed
    class:selected
    class:rightEdgeOfLocalBox
    on:click={handleSelect}
    on:keydown={handleKeydown}
>
    {value !== null || completed ? value : ""}
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

.completed {
    background-color: var(--color-secondary);
}

.selected {
    background-color: var(--color-primary);
}

.selected-empty {
    background-color: var(--color-primary-soft);
}

.selected-completed {
  background-color: var(--color-secondary-muted);
}

.rightEdgeOfLocalBox {
    border-right: 4px solid black;
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

</style>