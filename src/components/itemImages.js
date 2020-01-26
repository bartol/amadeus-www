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
        });
        setGlider(glider);
    }, []);

    return (
        <div>
            <div className='glider-wrap' ref={gliderRef}>
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
        </div>
    );
};
