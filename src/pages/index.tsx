import React, { useState } from 'react'
import Search from '../components/search'
import Layout from '../components/Layout'
import Cart from '../components/cart'

const App: React.FC = () => {
  const [cartOpened, isCartOpened] = useState(false)

  return (
    <Layout>
      <Search opened={cartOpened} />
      <button
        type="button"
        className={`toggleCart ${cartOpened ? 'open' : 'close'}`}
        onClick={() => isCartOpened(!cartOpened)}
      >
        Cart
      </button>
      <Cart opened={cartOpened} />
    </Layout>
  )
}

export default App
