/* eslint camelcase: 0 */
import React, { useState } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import isEmail from 'validator/lib/isEmail'
// @ts-ignore
import Checkbox from 'react-simple-checkbox'

interface Props {
  cart: any
}

const Checkout: React.FC<Props> = ({ cart }) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [newsletter, setNewsletter] = useState(false)
  const [terms, setTerms] = useState(false)
  const [emailToast, setEmailToast] = useState('')
  const [nameToast, setNameToast] = useState('')
  const [data, setData] = useState({
    pgw_amount: 0,
    pgw_authorization_type: 0,
    pgw_email: '',
    pgw_failure_url: '',
    pgw_first_name: '',
    pgw_order_id: '',
    pgw_shop_id: '',
    pgw_signature: '',
    pgw_success_url: ''
  })

  const result = () => {
    return cart
      .map((item: any) => {
        const arr = []
        for (let i = 0; i < item.cqt; i++) {
          arr.push(item.id__normalized)
        }
        return arr.join('')
      })
      .join('')
  }

  const refresh = () => {
    axios
      .get(
        `https://api.amadeus2.hr/signature?order=${result()}&name=${name}&email=${email}&newsletter=${newsletter}`
      )
      .then(res => {
        // console.log(res.data)
        setData(res.data)
      })
  }

  const handleEmailToast = (e: any) => {
    if (e.target.value === '') {
      setEmailToast('Email is missing')
    } else if (e.target.value !== '' && !isEmail(email)) {
      setEmailToast('Email not valid')
    } else {
      setEmailToast('')
    }
  }

  const handleNameToast = (e: any) => {
    if (e.target.value === '') {
      setNameToast('Name is missing')
    } else {
      setNameToast('')
    }
  }

  const handleInputChange = () => {
    if (name && isEmail(email)) {
      refresh()
    }
  }

  return (
    <div>
      <form
        id="payway-authorize-form"
        name="payway-authorize-form"
        method="post"
        action="https://pgwtest.ht.hr/services/payment/api/authorize-form"
        // onChange={handleInputChange}
      >
        <label htmlFor="name">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={name}
            // onChange={e => setName(e.target.value)}
            onChange={e => {
              setName(e.target.value)
              handleInputChange()
            }}
            onBlur={e => handleNameToast(e)}
          />
          {nameToast}
        </label>
        <br />
        <label htmlFor="email">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            // onChange={e => setEmail(e.target.value)}
            onChange={e => {
              setEmail(e.target.value)
              handleInputChange()
            }}
            onBlur={e => handleEmailToast(e)}
          />
          {emailToast}
        </label>
        <br />
        <Checkbox
          size={3}
          tickAnimationDuration={300}
          checked={newsletter}
          onChange={(isChecked: any) => {
            setNewsletter(isChecked)
            handleInputChange()
          }}
        />
        Newsletter
        <br />
        <Checkbox
          size={3}
          tickAnimationDuration={300}
          checked={terms}
          onChange={(isChecked: any) => setTerms(isChecked)}
        />
        Prihvacam uvjete o koristenju
        <br />
        {isEmail(email) &&
        email === data.pgw_email &&
        name === data.pgw_first_name &&
        terms ? (
          <button type="submit">Pay with payway</button>
        ) : (
          <button type="submit" disabled>
            Pay with payway
          </button>
        )}
        <input type="hidden" name="pgw_shop_id" value={data.pgw_shop_id} />
        <input type="hidden" name="pgw_order_id" value={data.pgw_order_id} />
        <input type="hidden" name="pgw_amount" value={data.pgw_amount} />
        <input
          type="hidden"
          name="pgw_authorization_type"
          value={data.pgw_authorization_type}
        />
        <input
          type="hidden"
          name="pgw_success_url"
          value={data.pgw_success_url}
        />
        <input
          type="hidden"
          name="pgw_failure_url"
          value={data.pgw_failure_url}
        />
        <input
          type="hidden"
          name="pgw_first_name"
          value={data.pgw_first_name}
        />
        <input type="hidden" name="pgw_email" value={data.pgw_email} />
        <input type="hidden" name="pgw_signature" value={data.pgw_signature} />
      </form>
      <br />
      {JSON.stringify(data, null, 2)}
    </div>
  )
}

export default connect((state: any) => ({
  cart: state.cart
}))(Checkout)
