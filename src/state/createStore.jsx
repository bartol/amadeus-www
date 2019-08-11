import React from 'react'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import reducer from './reducers'
import middleware from './middleware'
import { loadState, saveState } from './localStorage'

const persistedState = loadState()

const store = createStore(reducer, persistedState, middleware)

store.subscribe(() => {
  saveState(store.getState())
})

// const store = createStore(reducer, middleware)

// ///////////////////////////////
// testing
// ///////////////////////////////
// eslint-disable-next-line no-undef
// window.store = store

export default ({ element }) => {
  return <Provider store={store}>{element}</Provider>
}
