import React, { useState, useEffect } from 'react';
import { graphql } from 'gatsby';
import { Layout } from '../components/layout';
import { Card } from '../components/card';
import { Contact } from '../components/contact';
import { isBrowser } from '../helpers/isBrowser';

const Type = ({ data, pageContext }) => {
    const { language, type } = pageContext;

    const items = data.amadeus.items.filter(
        item => item.type[language] === type
    );

    const brands = [];
    items.forEach(item => {
        const index = brands.findIndex(b => b.name === item.brand);
        if (index === -1) {
            brands.push({
                name: item.brand,
                count: 1,
            });
        } else {
            brands[index].count++;
        }
    });

    const [selectedBrand, setSelectedBrand] = useState('');
    const [listItems, setListItems] = useState(items);
    const [length, setLength] = useState(
        isBrowser() ? (window.innerWidth > 550 ? 12 : 6) : 6
    );

    useEffect(() => {
        setListItems(
            selectedBrand
                ? listItems.filter(item => item.brand === selectedBrand)
                : items
        );
    }, [selectedBrand]);

    return (
        <Layout
            language={language}
            changeLanguageCustomUrl={{
                hr: `/${items[0].type.hr.toLowerCase()}/`,
                en: `/en/${items[0].type.en.toLowerCase()}/`,
            }}
        >
            {/* FIXME i18n */}
            <h1 className='type_heading'>U kategoriji: {type}</h1>
            <div className='shown_brands_mobile'>
                <span className='shown_brands_text'>
                    Prikazani brand{selectedBrand === '' ? 'ovi' : ''}:
                </span>
                <select
                    value={selectedBrand}
                    onChange={e => setSelectedBrand(e.target.value)}
                    className='shown_brands_select'
                >
                    {/* FIXME i18n */}
                    <option value=''>Svi ({items.length})</option>
                    {brands.map(brand => {
                        return (
                            <option value={brand.name} key={brand.name}>
                                {brand.name} ({brand.count})
                            </option>
                        );
                    })}
                </select>
            </div>
            <div className='list_container'>
                <ul className='shown_brands_desktop'>
                    <span>Prikazani brandovi</span>
                    {brands.map(brand => {
                        return (
                            <li key={brand.name}>
                                <button
                                    type='button'
                                    onClick={() =>
                                        brand.name !== selectedBrand
                                            ? setSelectedBrand(brand.name)
                                            : setSelectedBrand('')
                                    }
                                    className='brand_button'
                                    style={{
                                        background:
                                            brand.name === selectedBrand
                                                ? '#00d7d7'
                                                : 'transparent',
                                    }}
                                >
                                    <span className='brand_label'>
                                        {brand.name}
                                    </span>{' '}
                                    <span className='brand_count'>
                                        {brand.count}
                                    </span>
                                </button>
                            </li>
                        );
                    })}
                </ul>
                <ul className='itemsList'>
                    {listItems.slice(0, length).map(item => {
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
                </ul>
                {length < listItems.length && (
                    <button
                        type='button'
                        onClick={() => setLength(length + 6)}
                        className='load_more_button'
                    >
                        {/* FIXME i18n */}
                        Load more
                    </button>
                )}
            </div>
            <div className='item_contact'>
                <Contact />
            </div>
        </Layout>
    );
};

export default Type;

export const typeQuery = graphql`
    query typeQuery {
        amadeus {
            items {
                name {
                    hr
                    en
                }
                price
                discountedPrice
                slug
                id
                type {
                    hr
                    en
                }
                brand
                quantity
                availability {
                    hr
                    en
                }
                images {
                    index
                    src
                    optimized {
                        childImageSharp {
                            # cards
                            fluid(maxWidth: 240, maxHeight: 180) {
                                ...GatsbyImageSharpFluid_withWebp
                            }
                            # cart
                            fixed(width: 120, height: 90) {
                                ...GatsbyImageSharpFixed_withWebp
                            }
                        }
                    }
                }
            }
        }
    }
`;
