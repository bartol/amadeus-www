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
}) => {
    const {
        language,
        getLanguagePrefix,
        convertToCurrency,
        getQuantity,
        addToCart,
    } = useContext(SharedContext);

    if (hidden) return <></>;

    return (
        <li>
            <Link
                to={`${getLanguagePrefix(language)}/${type[
                    language
                ].toLowerCase()}/${slug}`}
            >
                <Image
                    fluid={image.optimized.childImageSharp.fluid}
                    // FIXME i18n
                    alt={`${name[language]} image`}
                    fadeIn
                />
                <h2>{name[language]}</h2>
                <h3>{convertToCurrency(price)}</h3>
                <h3>{getQuantity(id, quantity)}</h3>
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
            >
                {cart[language].addToCard}
            </button>
        </li>
    );
};
