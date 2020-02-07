import React, { useContext, useState, useEffect } from 'react';
import Image from 'gatsby-image';
import { request } from 'graphql-request';
import isEmail from 'validator/es/lib/isEmail';
import { SharedContext } from '../state/shared';

const signatureQuery = `query($input: SignatureParams!) {
  signature(input: $input) {
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
}`;

export const Cart = () => {
    const {
        language,
        cartVisible,
        setCartVisible,
        cart,
        incrementQuantity,
        decrementQuantity,
        removeFromCart,
        convertToCurrency,
    } = useContext(SharedContext);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [newsletter, setNewsletter] = useState(false);
    const [terms, setTerms] = useState(false);
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
    });

    useEffect(() => {
        if (cart.length && name && email && isEmail(email) && terms) {
            const order = [];
            cart.forEach(item => {
                for (let i = 0; i < item.quantity; i++) {
                    order.push(item.id);
                }
            });

            request('https://api.amadeus2.hr', signatureQuery, {
                input: {
                    order,
                    name,
                    email,
                    newsletter,
                    language,
                },
            }).then(data => setPgwData(data.signature));
        }
    }, [cart, email, name, terms]);

    return (
        <div
            className={`overlay ${cartVisible ? 'visible' : 'hidden'}`}
            onClick={e => {
                // if overlay and not its children is clicked
                if (e.target === e.currentTarget) {
                    setCartVisible(false);
                }
            }}
        >
            <div className='cart'>
                {/* FIXME i18n */}
                <h2>Cart</h2>
                <button type='button' onClick={() => setCartVisible(false)}>
                    {/* FIXME add icon */}
                    exit
                </button>
                <ul>
                    {cart.map(item => {
                        return (
                            <li key={item.id}>
                                <Image
                                    fixed={item.image}
                                    // FIXME i18n
                                    alt={`${name} thumbnail`}
                                    loading='lazy'
                                    fadeIn
                                />
                                <h3>{item.name[language]}</h3>
                                <h3>
                                    {convertToCurrency(item.discountedPrice)}
                                </h3>
                                <h3>{item.quantity}</h3>
                                <h3>{item.availability[language]}</h3>
                                <button
                                    type='button'
                                    onClick={() => removeFromCart(item.id)}
                                >
                                    remove from cart
                                </button>
                                <br />
                                <button
                                    type='button'
                                    onClick={() => incrementQuantity(item.id)}
                                >
                                    increment
                                </button>
                                <br />
                                <button
                                    type='button'
                                    onClick={() => decrementQuantity(item.id)}
                                >
                                    decrement
                                </button>
                            </li>
                        );
                    })}
                </ul>
                {/* TODO checkout */}
                <form
                    id='payway-authorize-form'
                    name='payway-authorize-form'
                    method='post'
                    action='https://pgwtest.ht.hr/services/payment/api/authorize-form'
                >
                    <input
                        type='text'
                        placeholder='Name'
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                    <input
                        type='email'
                        placeholder='Email'
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                    <input
                        type='checkbox'
                        checked={newsletter}
                        onChange={() => setNewsletter(!newsletter)}
                    />
                    Newsletter
                    <input
                        type='checkbox'
                        checked={terms}
                        onChange={() => setTerms(!terms)}
                    />
                    Prihvacam uvjete o koristenju
                    <button
                        // type='submit'
                        disabled={
                            !(
                                cart.length &&
                                terms &&
                                name &&
                                email &&
                                isEmail(email) &&
                                name === pgwData.first_name &&
                                email === pgwData.email
                            )
                        }
                    >
                        Pay with payway
                    </button>
                    <input
                        type='hidden'
                        name='pgw_shop_id'
                        value={pgwData.shop_id}
                    />
                    <input
                        type='hidden'
                        name='pgw_order_id'
                        value={pgwData.order_id}
                    />
                    <input
                        type='hidden'
                        name='pgw_amount'
                        value={pgwData.amount}
                    />
                    <input
                        type='hidden'
                        name='pgw_authorization_type'
                        value={pgwData.authorization_type}
                    />
                    <input
                        type='hidden'
                        name='pgw_success_url'
                        value={pgwData.success_url}
                    />
                    <input
                        type='hidden'
                        name='pgw_failure_url'
                        value={pgwData.failure_url}
                    />
                    <input
                        type='hidden'
                        name='pgw_first_name'
                        value={pgwData.first_name}
                    />
                    <input
                        type='hidden'
                        name='pgw_email'
                        value={pgwData.email}
                    />
                    <input
                        type='hidden'
                        name='pgw_email'
                        value={pgwData.order_info}
                    />
                    <input
                        type='hidden'
                        name='pgw_email'
                        value={pgwData.order_items}
                    />
                    <input
                        type='hidden'
                        name='pgw_signature'
                        value={pgwData.signature}
                    />
                </form>
                <pre>{JSON.stringify(pgwData, null, 2)}</pre>
                <pre>{JSON.stringify(name, null, 2)}</pre>
                <pre>{JSON.stringify(email, null, 2)}</pre>
                <pre>{JSON.stringify(terms, null, 2)}</pre>
                <pre>{JSON.stringify(newsletter, null, 2)}</pre>
            </div>
        </div>
    );
};
