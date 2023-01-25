import { writable } from 'svelte/store'

export const selectedCellStore = writable<null | number>(null)
export const selectedCellFilledStore = writable(false)
export const remainingCellsStore = writable(81)
export const selectedNumberStore = writable(0)
