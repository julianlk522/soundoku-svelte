<script lang='ts'>
    import {selectedCellStore, selectedNumberStore} from '../src/stores'
    import {onMount, createEventDispatcher} from 'svelte'
    import Row from "./Row.svelte";
    import {makepuzzle, solvepuzzle} from 'sudoku'

    const dispatch = createEventDispatcher()

    let start: (number | null)[]
    let board: (number | null)[] = []
    let solution: number[]
    let rows: (number | null)[][] = []

    let selectedCell: number | null = null
    selectedCellStore.subscribe(index => selectedCell = index)
    selectedNumberStore.subscribe(val => handleGuess(val))

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

      let n = 50 - filledNumsCount;
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
      selectedCellStore.set(event.detail.val)
    }

    function handleGuess(num: number) {
      if (selectedCell === null || board[selectedCell] !== null) return
      if (solution[selectedCell] === num) {
        return handleCorrectGuess()
      }
      dispatch('incorrect-guess')
    }

    function handleCorrectGuess() {
      if (selectedCell === null) return
      board.splice(selectedCell, 1, solution[selectedCell])
      setRows()
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
            on:select={handleCellSelected}
        />
    {/each}
</div>

<style>
#board {
  width: min-content;
  max-width: 75%;
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