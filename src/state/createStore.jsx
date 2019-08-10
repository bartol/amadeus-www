import React from 'react'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import reducer from './reducers'
// import thunk from 'redux-thunk'
import middleware from './middleware'

const store = createStore(reducer, middleware)

// testing
// eslint-disable-next-line no-undef
// window.store = store

export default ({ element }) => {
  return <Provider store={store}>{element}</Provider>
}
