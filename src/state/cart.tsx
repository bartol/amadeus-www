import React, { useState, createContext } from 'react'

export const CartContext = createContext()

export const CartProvider = ({ children }) => {
  const [isCartOpened, setIsCartOpened] = useState(false)
  const [cartContents, setCartContents] = useState([])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [newsletter, setNewsletter] = useState(false)

  return (
    <CartContext.Provider
      value={{
        isCartOpened,
        setIsCartOpened,
        cartContents,
        setCartContents,
        name,
        setName,
        email,
        setEmail,
        newsletter,
        setNewsletter,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
