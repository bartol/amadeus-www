import React, { useContext } from 'react';
import Image from 'gatsby-image';
import { SharedContext } from '../state/shared';

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
            </div>
        </div>
    );
};
