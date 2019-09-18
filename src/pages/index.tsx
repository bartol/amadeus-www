import React from 'react'
import { connect } from 'react-redux'
// @ts-ignore
import { toggleCart as reduxToggleCart } from '../state/actions'
import Search from '../components/search/search'
// import Search from '../components/search'
import Layout from '../components/Layout'
import Cart from '../components/cart'

interface Props {
  menu: any
  toggleCart: any
}

const App: React.FC<Props> = ({ menu, toggleCart }) => {
  // const [cartOpened, isCartOpened] = useState(false)

  return (
    <Layout>
      {/* <Search opened={cartOpened} /> */}
      <Search opened={menu.isCartOpened} toggleCart={toggleCart} />
      <button
        type="button"
        // className={`toggleCart ${cartOpened ? 'open' : 'close'}`}
        className={`toggleCart ${menu.isCartOpened ? 'open' : 'close'}`}
        // onClick={() => isCartOpened(!cartOpened)}
        onClick={() => toggleCart()}
      >
        Cart
      </button>
      {/* <Cart opened={cartOpened} /> */}
      <Cart opened={menu.isCartOpened} />
    </Layout>
  )
}

export default connect(
  (state: any) => ({
    menu: state.menu
  }),
  { toggleCart: reduxToggleCart }
)(App)
