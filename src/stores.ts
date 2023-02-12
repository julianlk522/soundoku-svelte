import { writable } from 'svelte/store'

export const selectedCellStore = writable<undefined | number>(undefined)
export const selectedCellWithNavigationStore = writable(false)
export const selectedCellFilledStore = writable(false)
export const remainingCellsStore = writable(81)
export const selectedNumberStore = writable<undefined | number>(undefined)

export const tutorialSelectedCellStore = writable(0)
export const tutorialRandomlyFilledCellsStore = writable<number[]>([])
export const tutorialSelectedNumberStore = writable<number | undefined>(
	undefined
)
export const tutorialErrorsStore = writable(0)
