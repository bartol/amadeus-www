import React, { useContext, useRef, useState, useLayoutEffect } from 'react';
import Image from 'gatsby-image';
import Glider from 'glider-js';
import { SharedContext } from '../state/shared';
import { item } from '../locales';

export const ItemImages = ({ images, name }) => {
    const { language } = useContext(SharedContext);

    const gliderRef = useRef(null);
    const [glider, setGlider] = useState({});
    useLayoutEffect(() => {
        if (!gliderRef.current) {
            return;
        }

        const glider = new Glider(gliderRef.current, {
            slidesToShow: 1,
            draggable: true,
            arrows: {
                prev: '.arrow-prev-hidden',
                next: '.arrow-next-hidden',
            },
        });
        setGlider(glider);

        document
            .querySelector('.item-glider')
            .addEventListener('glider-loaded', function() {
                document
                    .querySelectorAll('.item-glider > *')
                    .forEach(banner => {
                        banner.style.display = 'block';
                    });
            });
    }, []);

    return (
        <div className='item-carousel'>
            <div className='glider-wrap item-glider' ref={gliderRef}>
                {images.map(image => {
                    return (
                        <div key={image.index}>
                            <Image
                                fluid={image.optimized.childImageSharp.fluid}
                                // FIXME i18n
                                alt={`Image ${image.index} of ${name}`}
                                loading={image.index === 1 ? 'eager' : 'lazy'}
                                fadeIn
                            />
                        </div>
                    );
                })}
            </div>
            <div role='tablist'>
                {images.map(image => {
                    return (
                        <div
                            key={image.index}
                            onClick={() => glider.scrollItem(image.index - 1)}
                        >
                            <Image
                                fixed={image.optimized.childImageSharp.fixed}
                                // FIXME i18n
                                alt={`Thumbnail ${image.index} of ${name}`}
                                loading='lazy'
                                fadeIn
                            />
                        </div>
                    );
                })}
            </div>
            <div className='arrow-prev-hidden'></div>
            <div className='arrow-next-hidden'></div>
        </div>
    );
};
