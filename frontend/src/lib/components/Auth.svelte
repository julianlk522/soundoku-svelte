<script lang="ts">
	import { createEventDispatcher } from 'svelte'
	import { loggedInUserStore } from '../../stores'

	//  don't remove - these are called via eval()
	import { createUser, loginUser } from '../data'

	const dispatch = createEventDispatcher()

	let name = ''
	let pass = ''

	let loading = false
	let message = ''

	const authActions = ['login', 'create'] as const
	type AuthAction = (typeof authActions)[number]

	function formSubmit(event: SubmitEvent) {
		const action = (event.submitter as HTMLButtonElement)
			.value as AuthAction
		return authenticate(event, action)
	}

	async function authenticate(event: Event, action: AuthAction) {
		event.preventDefault()
		loading = true

		if (!authActions.includes(action)) {
			loading = false
			return (message = "hey, don't modify the client-side code 😋")
		}

		const response = await eval(`${action}User({name, pass})`)
		loading = false

		if (response.error) {
			return (message = response.error)
		}
		if (!response.name || !response.token) {
			return (message = 'Error: could not locate name or bearer token')
		}
		message = ''

		const { total_score, token } = response
		loggedInUserStore.set({ name, token, total_score })
		return localStorage.setItem('user', JSON.stringify({ name, token }))
	}
</script>

<div id="login-prompt">
	<h2>
		Please log in if you would like to submit your scores to the server and
		compete against other players
	</h2>

	{#if loading}
		<p>Loading...</p>
	{/if}

	{#if message}
		<p>{message}</p>
	{/if}

	<form on:submit|preventDefault={formSubmit}>
		<div class="input-group">
			<label for="name">Name</label>
			<input
				name="name"
				placeholder="Your name or tag"
				required
				bind:value={name}
				autocomplete="nickname"
			/>
		</div>
		<div class="input-group">
			<label for="password">Password</label>
			<input
				type="password"
				name="password"
				placeholder="Your password"
				required
				bind:value={pass}
				autocomplete="current-password"
			/>
		</div>
		<div id="actions">
			<button type="submit" value="login">Login</button>
			<button type="submit" value="create">Create new user</button>
		</div>
	</form>

	<button on:click={() => dispatch('enable-local-play')}
		>Nah, I'll just play locally</button
	>
</div>

<style>
	p,
	h2,
	input,
	label,
	button:hover,
	button:focus {
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
