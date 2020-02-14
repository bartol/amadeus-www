import React, { useContext } from 'react';
import { Link } from 'gatsby';
import { SharedContext } from '../state/shared';

export const Header = ({ changeLanguageCustomUrl }) => {
    const {
        language,
        getLanguagePrefix,
        setSearchVisible,
        setCartVisible,
        changeLanguage,
        currency,
        changeCurrency,
        cart,
    } = useContext(SharedContext);

    return (
        <header className='header'>
            <div className='main_part_header'>
                <Link to={`${getLanguagePrefix(language)}/`}>
                    <img src='/logo.png' alt='Amadeus logo' className='logo' />
                </Link>
                <button type='button' onClick={() => setSearchVisible(true)}>
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
                        className='feather feather-search'
                    >
                        <circle cx='11' cy='11' r='8'></circle>
                        <line x1='21' y1='21' x2='16.65' y2='16.65'></line>
                    </svg>
                </button>
                <button
                    type='button'
                    onClick={() => setCartVisible(true)}
                    className='cartButton'
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
                        className='feather feather-shopping-cart'
                    >
                        <circle cx='9' cy='21' r='1'></circle>
                        <circle cx='20' cy='21' r='1'></circle>
                        <path d='M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6'></path>
                    </svg>
                    {cart.length ? (
                        <span className='cartItemCount'>
                            {cart.reduce((acc, obj) => acc + obj.quantity, 0)}
                        </span>
                    ) : null}
                </button>
            </div>
            <select
                onChange={e =>
                    changeLanguage(e.target.value, changeLanguageCustomUrl)
                }
                value={language}
            >
                <option value='hr'>Hrvatski</option>
                <option value='en'>English</option>
            </select>
            <select
                value={currency}
                onChange={e => changeCurrency(e.target.value)}
            >
                <option value='HRK'>HRK</option>
                <option value='EUR'>EUR</option>
                <option value='BAM'>BAM</option>
                <option value='RSD'>RSD</option>
                <option value='USD'>USD</option>
                <option value='GBP'>GBP</option>
            </select>
        </header>
    );
};
