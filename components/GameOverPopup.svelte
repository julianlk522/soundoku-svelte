<script lang='ts'>
    import {createEventDispatcher} from 'svelte'
    const dispatch = createEventDispatcher()

    export let victoryTime = "0: 00"
    export let errors = 0
</script>

<div id='game-over'>
    <h2 id="congratulations">Congratulations, you won!</h2>
    <h3 id="victory-flex">💪</h3>
    <h3>Your time was:
        <span id="victory-time">
            {victoryTime}
        </span>
    </h3>
    <p id='errors'>(with {errors} errors)</p>
      <button
        id="replay"
        on:click={() => dispatch('new-game')}
      >
        Play Again?
      </button>
</div>

<style>
#game-over {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: 1.5rem;
  padding: 2rem;
  z-index: 1;
}

#congratulations {
  font-size: 2rem;
  color: var(--color-primary);
  text-shadow: 0px 2px 2px var(--color-secondary-soft);
}

#victory-time {
  font-weight: 700;
  color: var(--color-accent);
  text-shadow: 1px 1px 0px rgb(255 255 255 / 25%);
}

#victory-flex {
  font-size: 4rem;
  margin: 1rem 0;
}

#replay {
  color: white;
  margin-top: 2rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.25rem;
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

#replay:hover {
  transform: scale(1.1);
}

#replay:active {
  transform: scale(0.95);
}

@media (min-width: 640px) {
  #game-over {
    padding: 4rem;
  }

  #congratulations {
    font-size: 3rem;
  }

  #victory-flex {
    margin: 2rem 0;
  }

  h3:has(#victory-time), 
  #errors,
  #replay {
    font-size: 2rem;
  }

  #replay {
    margin-top: 4rem;
  }

  @media (min-width: 896px) {
    #congratulations {
      font-size: 4rem;
    }
  }
}

</style>