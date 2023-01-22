<script lang='ts'>
    import NumberSelectButton from "./NumberSelectButton.svelte";

    let nums = Array.from(Array(9)).map((_, i) => i + 1)

    export let time = ""
    export let errors = 0
</script>

<div class="flex-column">
    <div id="selection-grid">
        {#each nums as num (num)}
            <NumberSelectButton
                value={num}
            />
        {/each}
    </div>
    <h3 class="timer">{time}</h3>
    <h3 id="errors">Errors: {errors}</h3>
</div>


<style>
.flex-column {
    display: flex;
    flex-direction: column;
}

#selection-grid {
  width: auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  align-items: center;
}

.timer {
  text-align: center;
  margin-top: 1rem;
  display: inline-block;
  width: 100%;
  color: var(--color-accent);
  text-shadow: 1px 1px 0px var(--color-primary);
  font-size: 1.5rem;
}

#errors {
  margin-top: 1rem;
  font-size: 1rem;
  text-align: center;
}

@media (min-width: 640px) {
  #errors,
  .timer {
    margin-top: 2rem;
  }
  #errors {
    font-size: 1.5rem;
  }
}
</style>