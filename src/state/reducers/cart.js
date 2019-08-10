import {
  ADD_TO_CART,
  REMOVE_FROM_CART,
  INCREMENT_QUANTITY,
  DECREMENT_QUANTITY
} from '../constants/ActionTypes'

const cart = (state = [], action) => {
  switch (action.type) {
    case ADD_TO_CART:
      // return state.concat([action.item])
      return [...state, Object.assign({}, action.item, { qt: 1 })]
    case REMOVE_FROM_CART:
      return state.filter(item => item.id__normalized !== action.id)
    case INCREMENT_QUANTITY:
      return state.map(item =>
        item.id__normalized !== action.id
          ? item
          : Object.assign({}, item, { qt: item.qt + 1 })
      )
    case DECREMENT_QUANTITY:
      return state.map(item =>
        item.id__normalized !== action.id
          ? item
          : Object.assign({}, item, { qt: item.qt - 1 })
      )
    default:
      return state
  }
}

export default cart
