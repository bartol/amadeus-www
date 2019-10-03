import React, { useState, createContext } from 'react'

export const CheckoutContext = createContext()

export const CheckoutProvider = ({ children }) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [newsletter, setNewsletter] = useState(false)
  const [terms, setTerms] = useState(false)
  const [pgwData, setPgwData] = useState({
    shop_id: '',
    order_id: '',
    amount: 0,
    authorization_type: 0,
    language: '',
    success_url: '',
    failure_url: '',
    first_name: '',
    email: '',
    order_info: '',
    order_items: '',
    signature: '',
  })

  return (
    <CheckoutContext.Provider
      value={{
        name,
        setName,
        email,
        setEmail,
        newsletter,
        setNewsletter,
        terms,
        setTerms,
        pgwData,
        setPgwData,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  )
}
