import { writable } from 'svelte/store'
import type { User } from './lib/types'

export const boardStore = writable<(number | undefined)[]>([])
export const selectedCellStore = writable<undefined | number>(undefined)
export const selectedCellWithNavigationStore = writable(false)
export const selectedCellFilledStore = writable(false)
export const selectedNumberStore = writable<undefined | number>(undefined)

export const tutorialSelectedCellStore = writable(0)
export const tutorialRandomlyFilledCellsStore = writable<number[]>([])
export const tutorialSelectedNumberStore = writable<number | undefined>(
	undefined
)
export const tutorialErrorsStore = writable(0)

export const loggedInUserStore = writable<User>({
	name: localStorage.getItem('user')
		? JSON.parse(localStorage.getItem('user')!).name
		: undefined,
	token: localStorage.getItem('user')
		? JSON.parse(localStorage.getItem('user')!).token
		: undefined,
	total_score: undefined,
})
export const lastWinScoreStore = writable<number | undefined>(undefined)
