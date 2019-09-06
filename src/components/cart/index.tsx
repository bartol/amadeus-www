import React from 'react'
import { Link } from 'gatsby'
import { connect } from 'react-redux'
import {
  removeFromCart as reduxRemoveFromCart,
  incrementQuantity as reduxIncrementQuantity,
  decrementQuantity as reduxDecrementQuantity
  // @ts-ignore
} from '../../state/actions'
import CartImage from './cartImage'
import Checkout from '../checkout'

interface Props {
  cart: any
  opened: boolean
  incrementQuantity: any
  decrementQuantity: any
  removeFromCart: any
}

const Cart: React.FC<Props> = ({
  cart,
  opened,
  incrementQuantity,
  decrementQuantity,
  removeFromCart
}) => {
  return (
    <div className={`cart ${opened ? 'open' : 'close'}`}>
      <h3>Cart</h3>
      <div className="cart-child">
        {cart.length ? (
          <>
            <ul>
              {cart.map((item: any) => {
                const { name, price, slug, cqt, id__normalized: id } = item

                return (
                  <li key={slug}>
                    <h4>
                      <Link to={`/${slug}/`}>{name}</Link>
                    </h4>
                    <CartImage ImageKey={`${slug}-1`} />
                    <i>{id}</i>
                    <p>{price / 100} kn</p>
                    <p>{cqt}</p>
                    <button type="button" onClick={() => incrementQuantity(id)}>
                      +
                    </button>
                    <button
                      type="button"
                      onClick={() => decrementQuantity(item)}
                    >
                      -
                    </button>
                    <button type="button" onClick={() => removeFromCart(id)}>
                      Remove from cart
                    </button>
                  </li>
                )
              })}
            </ul>
            <Checkout />
          </>
        ) : (
          <p>Your cart is empty</p>
        )}
      </div>
    </div>
  )
}

export default connect(
  (state: any) => ({
    cart: state.cart
  }),
  {
    incrementQuantity: reduxIncrementQuantity,
    decrementQuantity: reduxDecrementQuantity,
    removeFromCart: reduxRemoveFromCart
  }
)(Cart)
