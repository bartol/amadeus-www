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
        <header>
            <nav>
                <a
                    href='mailto:amadeus@pioneer.hr'
                    target='_blank'
                    rel='noopener noreferrer'
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
                        className='feather feather-mail'
                    >
                        <path d='M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z'></path>
                        <polyline points='22,6 12,13 2,6'></polyline>
                    </svg>
                    amadeus@pioneer.hr
                </a>
                <a
                    href='tel:+38520670111'
                    target='_blank'
                    rel='noopener noreferrer'
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
                        className='feather feather-phone-call'
                    >
                        <path d='M15.05 5A5 5 0 0 1 19 8.95M15.05 1A9 9 0 0 1 23 8.94m-1 7.98v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z'></path>
                    </svg>
                    +385 (20) 670 111
                </a>
                <Link to={`${getLanguagePrefix(language)}/account/`}>
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
                        className='feather feather-user'
                    >
                        <path d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'></path>
                        <circle cx='12' cy='7' r='4'></circle>
                    </svg>
                    Moj racun
                </Link>
            </nav>
            <Link to={`${getLanguagePrefix(language)}/`}>
                <img
                    src='/logo.png'
                    alt='Amadeus logo'
                    width={200}
                    height={40}
                />
            </Link>
            <button type='button' onClick={() => setSearchVisible(true)}>
                {/* FIXME add icon */}
                search
            </button>
            <button type='button' onClick={() => setCartVisible(true)}>
                {/* FIXME add icon */}
                cart ({cart.reduce((acc, obj) => acc + obj.quantity, 0)})
            </button>
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
