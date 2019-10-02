import React, { useState } from 'react'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'

const query = gql`
  query(
    $order: [String!]!
    $name: String!
    $email: String!
    $newsletter: Boolean!
    $language: String!
  ) {
    signature(
      order: $order
      name: $name
      email: $email
      newsletter: $newsletter
      language: $language
    ) {
      shop_id
      order_id
      amount
      authorization_type
      language
      success_url
      failure_url
      first_name
      email
      order_info
      order_items
      signature
    }
  }
`

const Cart: React.FC = () => {
  const [statebtn, setStatebtn] = useState(false)
  const { loading, error, data } = useQuery(query, {
    variables: {
      order: ['00001', '00001'],
      name: 'Bartol<p>Test</p>',
      email: 'contact@bartol.dev',
      newsletter: true,
      language: 'hr',
    },
    skip: !statebtn,
  })

  return (
    <div>
      {loading && <p>Loading graphl data...</p>}
      {error && <p>Error: {error.message}</p>}
      {data && (
        <>
          <pre>{JSON.stringify(data, null, 2)}</pre>
          <form
            id='payway-authorize-form'
            name='payway-authorize-form'
            method='post'
            action='https://pgwtest.ht.hr/services/payment/api/authorize-form'
          >
            <input
              type='hidden'
              name='pgw_shop_id'
              value={data.signature.shop_id}
            />
            <input
              type='hidden'
              name='pgw_order_id'
              value={data.signature.order_id}
            />

            <input
              type='hidden'
              name='pgw_amount'
              value={data.signature.amount}
            />
            <input
              type='hidden'
              name='pgw_authorization_type'
              value={data.signature.authorization_type}
            />
            <input
              type='hidden'
              name='pgw_language'
              value={data.signature.language}
            />
            <input
              type='hidden'
              name='pgw_success_url'
              value={data.signature.success_url}
            />
            <input
              type='hidden'
              name='pgw_failure_url'
              value={data.signature.failure_url}
            />
            <input
              type='hidden'
              name='pgw_first_name'
              value={data.signature.first_name}
            />
            <input
              type='hidden'
              name='pgw_email'
              value={data.signature.email}
            />
            <input
              type='hidden'
              name='pgw_order_info'
              value={data.signature.order_info}
            />
            <input
              type='hidden'
              name='pgw_order_items'
              value={data.signature.order_items}
            />
            <input
              type='hidden'
              name='pgw_signature'
              value={data.signature.signature}
            />
            <button type='submit'>SUBMIT</button>
          </form>
        </>
      )}
      <button onClick={(): void => setStatebtn(!statebtn)}>FETCH</button>
    </div>
  )
}

export default Cart
