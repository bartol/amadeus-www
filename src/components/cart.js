import React, { useContext, useState, useEffect } from 'react';
import Image from 'gatsby-image';
import { request } from 'graphql-request';
import { SharedContext } from '../state/shared';

const signatureQuery = `query($input: SignatureParams!) {
  signature(input: $input) {
    shop_id
    cart_id 
    amount
    success_url
    failure_url
	cancel_url
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

    const [terms, setTerms] = useState(false);
    const [amount, setAmount] = useState('');
    const [pgwData, setPgwData] = useState({
        shop_id: '',
        cart_id: '',
        amount: '',
        success_url: '',
        failure_url: '',
        cancel_url: '',
        signature: '',
    });

    useEffect(() => {
        if (cart.length) {
            const order = [];
            let amount = 0;
            cart.forEach(item => {
                for (let i = 0; i < item.quantity; i++) {
                    order.push(item.id);
                    amount += item.price;
                }
            });

            const base = amount.toString().slice(0, -2);
            const fraction = amount.toString().slice(-2);
            setAmount(base + ',' + fraction);

            request('https://api.amadeus2.hr', signatureQuery, {
                input: {
                    order,
                    language,
                },
            }).then(data => setPgwData(data.signature));
        }
    }, [cart]);

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
                <div className='head'>
                    {/* FIXME i18n */}
                    <h2>Cart</h2>
                    <button type='button' onClick={() => setCartVisible(false)}>
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            width='24'
                            height='24'
                            viewBox='0 0 24 24'
                            fill='none'
                            stroke='currentColor'
                            strokeWidth='2'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            className='feather feather-x'
                        >
                            <line x1='18' y1='6' x2='6' y2='18'></line>
                            <line x1='6' y1='6' x2='18' y2='18'></line>
                        </svg>
                    </button>
                </div>
                <ul className='cartItems'>
                    {cart.map(item => {
                        return (
                            <li key={item.id} className='cartItem'>
                                <div className='cartItemHead'>
                                    <div className='cartImage'>
                                        <Image
                                            fixed={item.image}
                                            // FIXME i18n
                                            alt={`${name} thumbnail`}
                                            loading='lazy'
                                            fadeIn
                                        />
                                    </div>
                                    <div>
                                        <h3>{item.name[language]}</h3>
                                        <h3>{item.availability[language]}</h3>
                                    </div>
                                </div>
                                <div className='cartItemParams'>
                                    <h3>
                                        {convertToCurrency(
                                            item.discountedPrice
                                        )}
                                    </h3>
                                    <h3>{item.quantity}</h3>
                                    <button
                                        type='button'
                                        onClick={() => removeFromCart(item.id)}
                                    >
                                        remove from cart
                                    </button>
                                    <button
                                        type='button'
                                        onClick={() =>
                                            incrementQuantity(item.id)
                                        }
                                    >
                                        increment
                                    </button>
                                    <button
                                        type='button'
                                        onClick={() =>
                                            decrementQuantity(item.id)
                                        }
                                    >
                                        decrement
                                    </button>
                                </div>
                            </li>
                        );
                    })}
                </ul>
                <label className='terms_wrapper'>
                    <input
                        type='checkbox'
                        checked={terms}
                        onChange={() => setTerms(!terms)}
                    />
                    <span className='terms_label'>
                        Prihvacam uvjete o koristenju
                    </span>
                </label>
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
                        value={pgwData.amount}
                    />
                    <input
                        type='hidden'
                        name='Signature'
                        value={pgwData.signature}
                    />
                    <input
                        type='hidden'
                        name='ReturnURL'
                        value={pgwData.success_url}
                    />
                    <input
                        type='hidden'
                        name='CancelURL'
                        value={pgwData.cancel_url}
                    />
                    <input
                        type='hidden'
                        name='ReturnErrorURL'
                        value={pgwData.failure_url}
                    />
                    <input
                        type='hidden'
                        name='Lang'
                        value={language.toUpperCase()}
                    />
                    <input
                        type='submit'
                        value='Buy'
                        disabled={
                            !(cart.length && terms && amount === pgwData.amount)
                        }
                        className='buy_button'
                    />
                </form>
            </div>
        </div>
    );
};
