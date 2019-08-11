import React, { useEffect } from 'react'

export default () => {
  // eslint-disable-next-line no-undef
  useEffect(() => localStorage.removeItem('amadeus-cart'), [])
  return (
    <div>
      <h1>Your payment is successful!!</h1>
      <p>Thanks for purchasing from our store.</p>
    </div>
  )
}
