import React, { useRef, useLayoutEffect } from 'react';
import { navigate } from 'gatsby';
import Glider from 'glider-js';

const imgs = [
    'https://bartol.dev/img/md/algolia_create_index.png',
    'https://bartol.dev/img/md/algolia_api_keys.png',
];

export default () => {
    const gliderRef = useRef(null);

    let glider = {};
    useLayoutEffect(() => {
        glider = new Glider(gliderRef.current, {
            draggable: true,
            arrows: {
                prev: '.glider-prev',
                next: '.glider-next',
            },
        });
    }, []);

    return (
        <div className='glider-contain'>
            <div className='glider' ref={gliderRef} style={{ width: '50%' }}>
                {imgs.map(img => {
                    return (
                        <div key={img}>
                            <img src={img} style={{ width: '100%' }} />
                            <h2 onClick={() => navigate(img)}>test</h2>
                        </div>
                    );
                })}
            </div>

            <button role='button' aria-label='Previous' className='glider-prev'>
                «
            </button>
            <button role='button' aria-label='Next' className='glider-next'>
                »
            </button>
            <div role='tablist' className='dots'>
                {imgs.map((img, index) => {
                    return (
                        <div key={img}>
                            <img
                                src={img}
                                style={{ width: '10%' }}
                                onClick={() => glider.scrollItem(index)}
                                className={'dot '}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
