import React, { useContext, useState, useEffect } from 'react';
import Image from 'gatsby-image';
import { request } from 'graphql-request';
import isEmail from 'validator/es/lib/isEmail';
import { SharedContext } from '../state/shared';

const signatureQuery = `query($input: SignatureParams!) {
  signature(input: $input) {
    shop_id
    cart_id 
    amount
    language
    success_url
    failure_url
    email
    order_info
    order_items
    signature
    price
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

    const [email, setEmail] = useState('');
    const [newsletter, setNewsletter] = useState(false);
    const [terms, setTerms] = useState(false);
    const [pgwData, setPgwData] = useState({
        shop_id: '',
        order_id: '',
        amount: 0,
        language: '',
        success_url: '',
        failure_url: '',
        email: '',
        order_info: '',
        order_items: '',
        signature: '',
        price: '',
        cart_id: '',
    });

    useEffect(() => {
        if (cart.length && email && isEmail(email) && terms) {
            const order = [];
            cart.forEach(item => {
                for (let i = 0; i < item.quantity; i++) {
                    order.push(item.id);
                }
            });

            request('https://api.amadeus2.hr', signatureQuery, {
                input: {
                    order,
                    name: 'tmp',
                    email,
                    newsletter,
                    language,
                },
            }).then(data => setPgwData(data.signature));
        }
    }, [cart, email, terms]);

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
                <input
                    type='email'
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder='bartol.kasic@email.com'
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
                {/* TODO checkout */}
                <form
                    name='pay'
                    action='https://formtest.payway.com.hr/Authorization.aspx'
                    method='POST'
                >
                    <input
                        type='hidden'
                        name='ShopID'
                        value={pgwData.shop_id}
                    />
                    <input
                        type='hidden'
                        name='ShoppingCartID'
                        value={pgwData.cart_id}
                    />
                    <input
                        type='hidden'
                        name='TotalAmount'
                        value={pgwData.price}
                    />
                    <input
                        type='hidden'
                        name='Signature'
                        value={pgwData.signature}
                    />
                    <input
                        type='hidden'
                        name='ReturnURL'
                        value='https://78v2i6aivb.execute-api.us-east-1.amazonaws.com/dev/get'
                    />
                    <input
                        type='hidden'
                        name='CancelURL'
                        value='https://78v2i6aivb.execute-api.us-east-1.amazonaws.com/dev/get'
                    />
                    <input
                        type='hidden'
                        name='ReturnErrorURL'
                        value='https://78v2i6aivb.execute-api.us-east-1.amazonaws.com/dev/get'
                    />
                    <input
                        type='submit'
                        value='Buy'
                        disabled={
                            !(
                                cart.length &&
                                terms &&
                                email &&
                                isEmail(email) &&
                                email === pgwData.email
                            )
                        }
                    />
                </form>
                <pre>{JSON.stringify(pgwData, null, 2)}</pre>
                <pre>{JSON.stringify(email, null, 2)}</pre>
                <pre>{JSON.stringify(terms, null, 2)}</pre>
                <pre>{JSON.stringify(newsletter, null, 2)}</pre>
            </div>
        </div>
    );
};
