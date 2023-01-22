import { writable } from 'svelte/store'

export const selectedCellStore = writable(null)
export const remainingCellsStore = writable(81)
export const selectedNumberStore = writable(0)
