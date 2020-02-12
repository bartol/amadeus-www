import React, { useContext, useRef, useLayoutEffect } from 'react';
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
            arrows: {
                prev: '.featured-glider-prev',
                next: '.featured-glider-next',
            },
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
                        />
                    );
                })}
            </div>
            <button
                role='button'
                aria-label='Previous'
                className='featured-glider-prev'
            >
                «
            </button>
            <button
                role='button'
                aria-label='Next'
                className='featured-glider-next'
            >
                »
            </button>
            <div role='tablist' className='featured-dots'></div>
        </div>
    );
};
