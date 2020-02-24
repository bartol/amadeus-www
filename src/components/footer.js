import React, { useContext, useState } from 'react';
import { request } from 'graphql-request';
import isEmail from 'validator/es/lib/isEmail';
import { Link } from 'gatsby';
import { SharedContext } from '../state/shared';
import { footer } from '../locales';

const newsletterQuery = `mutation($email:String!) {
  newsletterSubscribe(email:$email)
}`;

export const Footer = () => {
    const { language, getLanguagePrefix } = useContext(SharedContext);

    const getLink = title => {
        return title
            .toLowerCase()
            .split(' ')
            .join('_');
    };

    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('');

    const newsletterSubmit = () => {
        setStatus('loading');
        request('https://api.amadeus2.hr', newsletterQuery, {
            email,
        }).then(data => setStatus(data.newsletterSubscribe));
    };

    return (
        <footer>
            <div className='footer'>
                <section className='newsletter_logo_wrapper'>
                    <h2>{footer[language].newsletter_header}</h2>
                    <div className='newsletter_container'>
                        <input
                            type='email'
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder='bartol.kasic@email.com'
                        />
                        <button
                            type='submit'
                            onClick={() => newsletterSubmit()}
                            disabled={!isEmail(email) || status === 'loading'}
                        >
                            {status
                                ? footer[language].newsletter_status[status]
                                : footer[language].newsletter_button}
                        </button>
                    </div>
                    <Link
                        to={`${getLanguagePrefix(language)}/`}
                        className='logo_footer_container'
                    >
                        <img
                            src='/logo.png'
                            alt='Amadeus logo'
                            className='logo_footer'
                        />
                    </Link>
                </section>
                <div className='support_contact_wrapper'>
                    <section className='support_wrapper'>
                        <h2>{footer[language].support_header}</h2>
                        <ul>
                            <li>
                                <Link to={getLink(footer[language].tos)}>
                                    {footer[language].tos}
                                </Link>
                            </li>
                            <li>
                                <Link to={getLink(footer[language].pp)}>
                                    {footer[language].pp}
                                </Link>
                            </li>
                            <li>
                                <Link to={getLink(footer[language].payment)}>
                                    {footer[language].payment}
                                </Link>
                            </li>
                            <li>
                                <Link to={getLink(footer[language].delivery)}>
                                    {footer[language].delivery}
                                </Link>
                            </li>
                            <li>
                                <Link to={getLink(footer[language].servicing)}>
                                    {footer[language].servicing}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to={`${getLanguagePrefix(
                                        language
                                    )}/account/`}
                                >
                                    {footer[language].acc}
                                </Link>
                            </li>
                        </ul>
                    </section>
                    <section className='contact_wrapper'>
                        <h2>{footer[language].contact_header}</h2>
                        <ul className='footer_list_with_icons'>
                            <li>
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
                            </li>
                            <li>
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
                            </li>
                            <li>
                                <address>
                                    <a
                                        href='https://goo.gl/maps/74YCcjpq3PBWpKZK9'
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
                                            className='feather feather-map-pin'
                                        >
                                            <path d='M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z'></path>
                                            <circle
                                                cx='12'
                                                cy='10'
                                                r='3'
                                            ></circle>
                                        </svg>
                                        Vladimira Nazora 45 Ploče
                                    </a>
                                </address>
                            </li>
                            <li>
                                <a
                                    href='https://www.instagram.com/amadeusploce/'
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
                                        className='feather feather-instagram'
                                    >
                                        <rect
                                            x='2'
                                            y='2'
                                            width='20'
                                            height='20'
                                            rx='5'
                                            ry='5'
                                        ></rect>
                                        <path d='M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z'></path>
                                        <line
                                            x1='17.5'
                                            y1='6.5'
                                            x2='17.51'
                                            y2='6.5'
                                        ></line>
                                    </svg>
                                    amadeusploce
                                </a>
                            </li>
                            <li>
                                <a
                                    href='https://www.facebook.com/amadeus.ploce'
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
                                        className='feather feather-facebook'
                                    >
                                        <path d='M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z'></path>
                                    </svg>
                                    Amadeus Ploče
                                </a>
                            </li>
                        </ul>
                    </section>
                </div>
            </div>
        </footer>
    );
};
