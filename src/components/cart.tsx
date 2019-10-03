import React, { useContext } from 'react'
import { CartContext } from '../state/global'

const Cart: React.FC = () => {
  const {
    itemsInCart,
    removeFromCart,
    incrementQuantity,
    decrementQuantity,
  } = useContext(CartContext)

  return (
    <div>
      <ul>
        {itemsInCart.map(item => {
          return (
            <li key={item.id}>
              <h3>{item.name}</h3>
              <p>{item.quantity}</p>
              <button type='button' onClick={() => removeFromCart(item.id)}>
                remove from cart
              </button>
              <br />
              <button type='button' onClick={() => incrementQuantity(item.id)}>
                increment
              </button>
              <br />
              <button type='button' onClick={() => decrementQuantity(item.id)}>
                decrement
              </button>
            </li>
          )
        })}
      </ul>

      {/* action='https://pgwtest.ht.hr/services/payment/api/authorize-form' */}
      {/* <form name='payway-authorize-form' method='post'>
        <PgwInput name='shop_id' value={pgwData.shop_id} />
        <PgwInput name='order_id' value={pgwData.order_id} />
        <PgwInput name='amount' value={pgwData.amount} />
        <PgwInput
          name='authorization_type'
          value={pgwData.authorization_type}
        />
        <PgwInput name='language' value={pgwData.language} />
        <PgwInput name='success_url' value={pgwData.success_url} />
        <PgwInput name='failure_url' value={pgwData.failure_url} />
        <PgwInput name='first_name' value={pgwData.first_name} />
        <PgwInput name='email' value={pgwData.email} />
        <PgwInput name='order_info' value={pgwData.order_info} />
        <PgwInput name='order_items' value={pgwData.order_items} />
        <PgwInput name='signature' value={pgwData.signature} />
      </form> */}
    </div>
  )
}

// const PgwInput = (name: string, value: string) => {
//   return <input type='hidden' name={`pgw_${name}`} value={value} />
// }

export default Cart
