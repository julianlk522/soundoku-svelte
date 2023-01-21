<script>
    let selectedCell = false
    let completed = false
    let value = 5
</script>

<button class="cell" on:click={() => selectedCell = !selectedCell} class:selected={selectedCell}>
    {completed ? value : ""}
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

.edgeOfLocalBox {
    border-right: 4px solid black;
}

</style>