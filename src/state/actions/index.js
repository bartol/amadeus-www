import * as types from '../constants/ActionTypes'

const addToCartUnsafe = item => ({
  type: types.ADD_TO_CART,
  item
})

export const incrementQuantityUnsafe = id => ({
  type: types.INCREMENT_QUANTITY,
  id
})

export const removeFromCart = id => ({
  type: types.REMOVE_FROM_CART,
  id
})

export const incrementQuantity = id => dispatch => {
  // const result = getState().cart.filter(e => e.id__normalized === id)
  // if (result[0].qt < qt) {
  dispatch(incrementQuantityUnsafe(id))
  // }
}

export const decrementQuantityUnsafe = id => ({
  type: types.DECREMENT_QUANTITY,
  id
})

export const decrementQuantity = item => dispatch => {
  if (item.cqt > 1) {
    dispatch(decrementQuantityUnsafe(item.id__normalized))
  } else {
    dispatch(removeFromCart(item.id__normalized))
  }
}

export const addToCart = item => (dispatch, getState) => {
  if (getState().cart.some(e => e.id__normalized === item.id__normalized)) {
    dispatch(incrementQuantity(item.id__normalized))
  } else {
    dispatch(addToCartUnsafe(item))
  }
}

export const toggleCart = () => ({
  type: types.TOGGLE_CART
})
