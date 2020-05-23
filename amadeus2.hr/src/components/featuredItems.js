import React, { useContext, useRef, useState, useLayoutEffect } from 'react';
import Glider from 'glider-js';
import { SharedContext } from '../state/shared';
import { Card } from './card';

export const FeaturedItems = ({ items }) => {
    const { language } = useContext(SharedContext);

    const gliderRef = useRef(null);
    useLayoutEffect(() => {
        if (!gliderRef.current) {
            return;
        }

        new Glider(gliderRef.current, {
            dots: '.featured-dots',
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: {
                prev: '.featured-glider-prev',
                next: '.featured-glider-next',
            },
            responsive: [
                {
                    breakpoint: 525,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1,
                        itemWidth: 250,
                        duration: 0.25,
                    },
                },
                {
                    breakpoint: 850,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 1,
                        itemWidth: 250,
                        duration: 0.25,
                    },
                },
                {
                    breakpoint: 1150,
                    settings: {
                        slidesToShow: 4,
                        slidesToScroll: 1,
                        itemWidth: 250,
                        duration: 0.25,
                    },
                },
            ],
        });

        document
            .querySelector('.featured-glider')
            .addEventListener('glider-loaded', function() {
                document
                    .querySelectorAll('.featured-glider > *')
                    .forEach(item => {
                        item.style.display = 'block';
                    });
            });
    }, []);
    return (
        <div>
            {/* FIXME i18n */}
            <h2 className='featured_heading'>Izdvojeni proizvodi</h2>
            <div className='glider-wrap featured-glider' ref={gliderRef}>
                {items.map(item => {
                    return (
                        <Card
                            name={item.name}
                            price={item.price}
                            discountedPrice={item.discountedPrice}
                            image={item.images[0]}
                            type={item.type}
                            quantity={item.quantity}
                            availability={item.availability}
                            slug={item.slug}
                            id={item.id}
                            key={item.id}
                            featured={true}
                        />
                    );
                })}
            </div>
            <nav className='carousel_nav'>
                <button
                    role='button'
                    aria-label='Previous'
                    className='featured-glider-prev'
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
                <div role='tablist' className='featured-dots'></div>
                <button
                    role='button'
                    aria-label='Next'
                    className='featured-glider-next'
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
    );
};
