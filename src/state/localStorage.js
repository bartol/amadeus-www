/* eslint-disable no-undef */
export const loadState = () => {
  try {
    const serializedState = localStorage.getItem('amadeus-cart')
    if (serializedState === null) {
      return undefined
    }
    return JSON.parse(serializedState)
  } catch (err) {
    return undefined
  }
}

export const saveState = state => {
  try {
    const serializedState = JSON.stringify(state)
    localStorage.setItem('amadeus-cart', serializedState)
  } catch {
    // ignore write errors
  }
}
