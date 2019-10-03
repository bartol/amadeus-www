import React, { useState, createContext } from 'react'

export const CartContext = createContext()

export const CartProvider = ({ children }) => {
  const [itemsInCart, setItemsInCart] = useState([])

  const incrementQuantity = id => {
    return setItemsInCart(
      itemsInCart.map(item =>
        item.id === id && item.quantity < item.maxQuantity
          ? { ...item, ...{ quantity: item.quantity + 1 } }
          : item
      )
    )
  }

  const removeFromCart = id => {
    return setItemsInCart(itemsInCart.filter(item => item.id !== id))
  }

  const decrementQuantity = id => {
    // if decrementing item with quantity 1 then remove item
    if (itemsInCart.find(e => e.id === id).quantity === 1) {
      return removeFromCart(id)
    }

    return setItemsInCart(
      itemsInCart.map(item =>
        item.id === id && item.quantity > 1
          ? { ...item, ...{ quantity: item.quantity - 1 } }
          : item
      )
    )
  }

  const addToCart = item => {
    // if item is already in cart increment quantity
    if (itemsInCart.some(e => e.id === item.id)) {
      return incrementQuantity(item.id)
    }

    return setItemsInCart([
      ...itemsInCart,
      { ...item, ...{ maxQuantity: item.quantity, quantity: 1 } },
    ])
  }

  const getQuantity = (id, quantity) => {
    const item = itemsInCart.find(e => e.id === id)

    if (item) {
      return quantity - item.quantity
    }

    return quantity
  }

  return (
    <CartContext.Provider
      value={{
        itemsInCart,
        addToCart,
        removeFromCart,
        incrementQuantity,
        decrementQuantity,
        getQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
