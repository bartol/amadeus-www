import React, { useContext } from 'react';
import { Link } from 'gatsby';
import Image from 'gatsby-image';
import { SharedContext } from '../state/shared';
import { cart } from '../locales';

export const Card = ({
    name,
    price,
    discountedPrice,
    image,
    type,
    quantity,
    availability,
    slug,
    id,
    hidden,
    featured,
}) => {
    const {
        language,
        getLanguagePrefix,
        convertToCurrency,
        getQuantity,
        addToCart,
        setSearchVisible,
    } = useContext(SharedContext);

    if (hidden) return <></>;

    return (
        <li className={`card ${featured ? 'featured' : 'regular'}`}>
            <Link
                to={`${getLanguagePrefix(language)}/${type[
                    language
                ].toLowerCase()}/${slug}/`}
                onClick={() => setSearchVisible('')}
            >
                <Image
                    fluid={image.optimized.childImageSharp.fluid}
                    // FIXME i18n
                    alt={`${name[language]} image`}
                    fadeIn
                />
                <h2>{name[language]}</h2>
                <div className='card_params'>
                    {discountedPrice === price ? (
                        <h3>{convertToCurrency(price)}</h3>
                    ) : (
                        <h3 className='price_and_discount_card'>
                            <strike>{convertToCurrency(price)}</strike>
                            {convertToCurrency(discountedPrice)}
                        </h3>
                    )}
                    <h3 className='card_quantity'>
                        {getQuantity(id, quantity)} kom.
                    </h3>
                </div>
            </Link>
            <button
                type='button'
                onClick={() =>
                    addToCart({
                        name,
                        price,
                        discountedPrice,
                        quantity,
                        availability,
                        image: image.optimized.childImageSharp.fixed,
                        id,
                    })
                }
                disabled={getQuantity(id, quantity) === 0}
                className='add_to_cart_button'
            >
                {cart[language].addToCard}
            </button>
        </li>
    );
};
