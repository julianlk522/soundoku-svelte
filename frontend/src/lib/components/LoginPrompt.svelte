<script lang='ts'>
    import {createEventDispatcher} from 'svelte'
    import {createUser} from '../data'

    const dispatch = createEventDispatcher()

    let name = ''
    let pass = ''

    let loading = false
    let message = ""

    async function loginUser(e: Event) {
        //  todo
    }

    async function createNewUser(e: Event) {
        e.preventDefault()
        loading = true
        const response = await createUser({name, pass})
        loading = false

        if (response.error) {
            return message = `Error: ${response.error}`
        }
        message = ""
        return dispatch('login', {name: response.name, token: response.token})
    }
</script>

<div id='login-prompt'>
    <h2>Please log in if you would like to submit your scores to the server and compete against other players</h2>

    {#if loading}
        <p>Loading...</p>
    {/if}

    {#if message}
        <p>{message}</p>
    {/if}

    <form on:submit={loginUser}>
        <div class="input-group">
            <label for="name">Name</label>
            <input name='name' placeholder='Your name or tag' required bind:value={name} autocomplete="nickname"/>
        </div>
        <div class="input-group">
            <label for="password">Password</label>
            <input type='password' name='password' placeholder='Your password' required bind:value={pass} autocomplete="current-password"/>
        </div>
        <div id="actions">
            <button type="submit">Login</button>
            <button on:click={createNewUser}>Create new user</button>
        </div>
    </form>
    
    <button on:click={() => dispatch('enable-local-play')}>Nah, I'll just play locally</button>
</div>



<style>
    p, h2, input, label, button:hover, button:focus {
        color: var(--color-text-light);
    }
    #login-prompt {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        align-items: center;
    }
    .input-group {
        min-width: 350px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    input {
        padding-left: 1rem;
    }
    #actions {
        margin-top: 1rem;
        display: flex;
        justify-content: space-evenly;
    }
    #actions button {
        width: 40%;
    }
</style>