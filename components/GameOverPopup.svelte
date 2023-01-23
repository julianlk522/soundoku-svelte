<script lang='ts'>
    import {createEventDispatcher} from 'svelte'
    const dispatch = createEventDispatcher()

    export let victoryTime = "0: 00"
    export let errors = 0
</script>

<div id='game-over'>
    <h2 id="congratulationsText">Congratulations, you won!</h2>
    <h3 id="victoryFlex">💪</h3>
    <h3>Your time was:
        <span id="victoryTime">
            {victoryTime}
        </span>
    </h3>
    <p>(with {errors} errors)</p>
      <button
        id="replayButton"
        class="button"
        on:click={() => dispatch('new-game')}
      >
        Play Again?
      </button>
</div>

<style>
#game-over {
  font-size: 1.5rem;
  z-index: 1;
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

#congratulationsText {
  font-size: 4rem;
  color: var(--color-primary);
  text-shadow: 0px 2px 2px var(--color-secondary-soft);
}

#victoryTime {
  font-weight: 700;
  color: var(--color-accent);
  text-shadow: 1px 1px 0px var(--color-primary);
}

#victoryFlex {
  font-size: 4rem;
  margin: 1rem 0;
}

#replayButton {
  border: none;
  border-radius: 0.25rem;
  color: white;
  padding: 0.5rem 1rem;
  box-shadow: 0px 0px 4px rgb(0 0 0 / 25%);
  text-shadow: 1px 1px 0px var(--color-primary);
  background-image: linear-gradient(
    45deg,
    hsl(240deg 100% 35%) 0%,
    hsl(232deg 100% 35%) 0%,
    hsl(223deg 100% 35%) 4%,
    hsl(215deg 100% 35%) 12%,
    hsl(206deg 100% 35%) 26%,
    hsl(198deg 100% 36%) 45%,
    hsl(189deg 100% 36%) 66%,
    hsl(181deg 100% 36%) 83%,
    hsl(172deg 100% 36%) 94%,
    hsl(164deg 100% 36%) 100%
  );
}

</style>