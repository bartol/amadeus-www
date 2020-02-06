// FIXME i18n
import React, { useContext, useRef, useLayoutEffect } from 'react';
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
    }, []);

    return (
        <div>
            <div className='mobile'>
                <div className='glider-wrap' ref={gliderMobileRef}>
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
                                    to={image.link}
                                    className='banner_learn_more'
                                >
                                    Saznaj vise
                                </Link>
                            </div>
                        );
                    })}
                </div>
                <button
                    role='button'
                    aria-label='Previous'
                    className='mobile-glider-prev'
                >
                    «
                </button>
                <button
                    role='button'
                    aria-label='Next'
                    className='mobile-glider-next'
                >
                    »
                </button>
                <div role='tablist' className='mobile-dots'></div>
            </div>
            <div className='desktop'>
                <div className='glider-wrap' ref={gliderDesktopRef}>
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
                                    to={image.link}
                                    className='banner_learn_more'
                                >
                                    Saznaj vise
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
