import { TOGGLE_CART } from '../constants/ActionTypes'

const initialState = {
  isCartOpened: false
}

const menu = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_CART:
      return { ...state, isCartOpened: !state.isCartOpened }
    default:
      return state
  }
}

export default menu
