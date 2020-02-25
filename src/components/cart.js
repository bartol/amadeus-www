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
            const amount = cart.reduce(
                (acc, obj) => acc + obj.discountedPrice * obj.quantity,
                0
            );
            setAmount(amount);

            const order = [];
            cart.forEach(item => {
                for (let i = 0; i < item.quantity; i++) {
                    order.push(item.id);
                }
            });

            request('https://api.amadeus2.hr', signatureQuery, {
                input: {
                    order,
                    language,
                },
            }).then(data => setPgwData(data.signature));
        }
    }, [cart]);

    useEffect(() => {
        if (cartVisible) {
            document.querySelector('body').classList.add('disable_scroll');
        } else {
            document.querySelector('body').classList.remove('disable_scroll');
        }
    }, [cartVisible]);

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
                    <h2>Košarica</h2>
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
                                        <h3 className='availability'>
                                            {item.availability[language]}
                                        </h3>
                                    </div>
                                </div>
                                <div className='cartItemParams'>
                                    {item.discountedPrice === item.price ? (
                                        <h3>{convertToCurrency(item.price)}</h3>
                                    ) : (
                                        <h3 className='price_and_discount'>
                                            <strike>
                                                {convertToCurrency(item.price)}
                                            </strike>
                                            <br />
                                            {convertToCurrency(
                                                item.discountedPrice
                                            )}
                                        </h3>
                                    )}
                                    <h3 className='item_quantity'>
                                        {item.quantity} kom.
                                    </h3>
                                    <div>
                                        <button
                                            type='button'
                                            onClick={() =>
                                                incrementQuantity(item.id)
                                            }
                                            disabled={
                                                item.quantity ===
                                                item.maxQuantity
                                            }
                                        >
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
                                                className='feather feather-plus'
                                            >
                                                <line
                                                    x1='12'
                                                    y1='5'
                                                    x2='12'
                                                    y2='19'
                                                ></line>
                                                <line
                                                    x1='5'
                                                    y1='12'
                                                    x2='19'
                                                    y2='12'
                                                ></line>
                                            </svg>
                                        </button>
                                        <button
                                            type='button'
                                            onClick={() =>
                                                decrementQuantity(item.id)
                                            }
                                        >
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
                                                className='feather feather-minus'
                                            >
                                                <line
                                                    x1='5'
                                                    y1='12'
                                                    x2='19'
                                                    y2='12'
                                                ></line>
                                            </svg>
                                        </button>
                                        <button
                                            type='button'
                                            onClick={() =>
                                                removeFromCart(item.id)
                                            }
                                        >
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
                                                className='feather feather-trash-2'
                                            >
                                                <polyline points='3 6 5 6 21 6'></polyline>
                                                <path d='M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2'></path>
                                                <line
                                                    x1='10'
                                                    y1='11'
                                                    x2='10'
                                                    y2='17'
                                                ></line>
                                                <line
                                                    x1='14'
                                                    y1='11'
                                                    x2='14'
                                                    y2='17'
                                                ></line>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ul>
                {cart.length ? (
                    <h2 className='total'>
                        <span>Ukupno:</span>
                        <span>{convertToCurrency(amount)}</span>
                    </h2>
                ) : null}
                {!cart.length ? (
                    <div className='empty_cart'>
                        <img src='/sad_face.png' />
                        <span>Vaša košarica je prazna.</span>
                    </div>
                ) : null}
                <label className='terms_wrapper'>
                    <input
                        type='checkbox'
                        checked={terms}
                        onChange={() => setTerms(!terms)}
                    />
                    <span className='terms_label'>
                        Prihvaćam uvjete o korištenju.
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
                            !(
                                cart.length &&
                                terms &&
                                amount ===
                                    parseInt(pgwData.amount.replace(',', ''))
                            )
                        }
                        className='buy_button'
                    />
                </form>
            </div>
        </div>
    );
};
