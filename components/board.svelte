<script lang='ts'>
    import {onMount} from 'svelte'
    import Row from "./row.svelte";
    import {makepuzzle, solvepuzzle} from 'sudoku'

    let start: (number | null)[]
    let board: (number | null)[] = []
    let solution: number[]
    let rows: (number | null)[][] = []
    let selectedCell: number | null = null

    //  split board into groups of 9 and assign product to rows
    function setRows() {
        rows = [];
        for (let r = 0; r < 9; r++) {
            rows.push(board.slice(r * 9, r * 9 + 9));
        }
    }

    function fillCellsToDecreaseDifficulty() {
      //  check for number of initially filled spaces
      let filledNumsCount = start.filter(
        (val: number | null) => val !== null
      ).length;

      let n = 80 - filledNumsCount;
      const checkedIndices = [];

      while (n > 0) {
        const randomIndex = Math.floor(Math.random() * 81);
        if (
          checkedIndices.indexOf(randomIndex) === -1 &&
          start[randomIndex] === null
        ) {
          start.splice(randomIndex, 1, solution[randomIndex]);
          n--;
        }
        checkedIndices.push(randomIndex);
      }
    }

    function handleCellSelected(event: CustomEvent) {
      selectedCell = event.detail.val
    }

    onMount(() => {
        start = makepuzzle()
        
        //  solvepuzzle() relies on a range of 0-8 so it must be run before mapping values to 1-9
        solution = solvepuzzle(start).map((num: number) => num + 1)
        
        start = start.map((num: number | null) => num != null ? num + 1 : null)
        fillCellsToDecreaseDifficulty()
        board = [...start]

        setRows()
    })
</script>

<div id='board'>
    {#each rows as row, i}
        <Row
            rowIndex = {i}
            {row}
            {selectedCell}
            on:select={handleCellSelected}
        />
    {/each}
</div>

<style>
#board {
  width: auto;
  border: 4px solid black;
  margin-bottom: 2rem;
  background-color: #eee;
}

@media (min-width: 640px) {
  #board {
    margin-bottom: 4rem;
  }
}

@media (min-width: 896px) {
  #board {
    margin-bottom: 0rem;
  }
}
</style>