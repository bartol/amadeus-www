// FIXME i18n
import React, { useContext, useRef, useLayoutEffect, useEffect } from 'react';
import { Link } from 'gatsby';
import Image from 'gatsby-image';
import Glider from 'glider-js';
import { SharedContext } from '../state/shared';

export const Banners = ({ banners }) => {
    const { desktop, mobile } = banners;
    const { language } = useContext(SharedContext);

    const gliderDesktopRef = useRef(null);
    useLayoutEffect(() => {
        if (!gliderDesktopRef.current) {
            return;
        }

        new Glider(gliderDesktopRef.current, {
            draggable: true,
            dragVelocity: 2,
            dots: '.desktop-dots',
            arrows: {
                prev: '.desktop-glider-prev',
                next: '.desktop-glider-next',
            },
        });

        document
            .querySelector('.desktop-banner-glider')
            .addEventListener('glider-loaded', function() {
                document
                    .querySelectorAll('.desktop-banner-glider > *')
                    .forEach(banner => {
                        banner.style.display = 'block';
                    });
            });
    }, []);

    const gliderMobileRef = useRef(null);
    useLayoutEffect(() => {
        if (!gliderMobileRef.current) {
            return;
        }

        new Glider(gliderMobileRef.current, {
            draggable: true,
            dragVelocity: 2,
            dots: '.mobile-dots',
            arrows: {
                prev: '.mobile-glider-prev',
                next: '.mobile-glider-next',
            },
        });

        document
            .querySelector('.mobile-banner-glider')
            .addEventListener('glider-loaded', function() {
                document
                    .querySelectorAll('.mobile-banner-glider > *')
                    .forEach(banner => {
                        banner.style.display = 'block';
                    });
            });
    }, []);

    return (
        <div>
            <div className='mobile'>
                <div
                    className='glider-wrap mobile-banner-glider'
                    ref={gliderMobileRef}
                >
                    {mobile.map((image, index) => {
                        return (
                            <div key={index} className='banner'>
                                <Image
                                    fluid={
                                        image.optimized.childImageSharp.fluid
                                    }
                                    // FIXME i18n
                                    alt={`Banner ${index + 1}`}
                                    loading={index === 0 ? 'eager' : 'lazy'}
                                    fadeIn
                                />
                                <Link
                                    to={image.link[language]}
                                    className='banner_learn_more'
                                >
                                    Saznaj više
                                </Link>
                            </div>
                        );
                    })}
                </div>
                <nav className='carousel_nav'>
                    <button
                        role='button'
                        aria-label='Previous'
                        className='mobile-glider-prev'
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
                            className='feather feather-chevrons-left'
                        >
                            <polyline points='11 17 6 12 11 7'></polyline>
                            <polyline points='18 17 13 12 18 7'></polyline>
                        </svg>
                    </button>
                    <div role='tablist' className='mobile-dots'></div>
                    <button
                        role='button'
                        aria-label='Next'
                        className='mobile-glider-next'
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
                            className='feather feather-chevrons-right'
                        >
                            <polyline points='13 17 18 12 13 7'></polyline>
                            <polyline points='6 17 11 12 6 7'></polyline>
                        </svg>
                    </button>
                </nav>
            </div>
            <div className='desktop'>
                <div
                    className='glider-wrap desktop-banner-glider'
                    ref={gliderDesktopRef}
                >
                    {desktop.map((image, index) => {
                        return (
                            <div key={index} className='banner'>
                                <Image
                                    fluid={
                                        image.optimized.childImageSharp.fluid
                                    }
                                    // FIXME i18n
                                    alt={`Banner ${index + 1}`}
                                    loading={index === 0 ? 'eager' : 'lazy'}
                                    fadeIn
                                />
                                <Link
                                    to={image.link[language]}
                                    className='banner_learn_more'
                                >
                                    Saznaj više
                                </Link>
                            </div>
                        );
                    })}
                </div>
                <button
                    role='button'
                    aria-label='Previous'
                    className='desktop-glider-prev'
                >
                    «
                </button>
                <button
                    role='button'
                    aria-label='Next'
                    className='desktop-glider-next'
                >
                    »
                </button>
                <div role='tablist' className='desktop-dots'></div>
            </div>
        </div>
    );
};
