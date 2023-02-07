import { writable } from 'svelte/store'

export const selectedCellStore = writable<null | number>(null)
export const selectedCellFilledStore = writable(false)
export const remainingCellsStore = writable(81)
export const selectedNumberStore = writable<undefined | number>(undefined)

export const tutorialSelectedCellStore = writable(0)
export const tutorialRandomlyFilledCellsStore = writable<number[]>([])
export const tutorialSelectedNumberStore = writable<number | undefined>(
	undefined
)
export const tutorialErrorsStore = writable(0)
