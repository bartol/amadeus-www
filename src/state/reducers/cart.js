import {
  ADD_TO_CART,
  REMOVE_FROM_CART,
  INCREMENT_QUANTITY,
  DECREMENT_QUANTITY
} from '../constants/ActionTypes'

const cart = (state = [], action) => {
  switch (action.type) {
    case ADD_TO_CART:
      return [...state, Object.assign({}, action.item, { cqt: 1 })]
    case REMOVE_FROM_CART:
      return state.filter(item => item.id__normalized !== action.id)
    case INCREMENT_QUANTITY:
      return state.map(item =>
        item.id__normalized === action.id && item.cqt < item.qt
          ? Object.assign({}, item, { cqt: item.cqt + 1 })
          : item
      )
    case DECREMENT_QUANTITY:
      return state.map(item =>
        item.id__normalized !== action.id
          ? item
          : Object.assign({}, item, { cqt: item.cqt - 1 })
      )
    default:
      return state
  }
}

export default cart
