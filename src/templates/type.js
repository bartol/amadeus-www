import React, { useState, useEffect } from 'react';
import { graphql } from 'gatsby';
import { Layout } from '../components/layout';
import { Card } from '../components/card';
import { Contact } from '../components/contact';

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
    const [length, setLength] = useState(3);

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
            {/* <ul> */}
            {/*     {brands.map(brand => { */}
            {/*         return ( */}
            {/*             <li */}
            {/*                 onClick={() => */}
            {/*                     brand.name !== selectedBrand */}
            {/*                         ? setSelectedBrand(brand.name) */}
            {/*                         : setSelectedBrand('') */}
            {/*                 } */}
            {/*                 key={brand.name} */}
            {/*             > */}
            {/*                 {brand.name} ({brand.count}) */}
            {/*             </li> */}
            {/*         ); */}
            {/*     })} */}
            {/* </ul> */}
            {/* FIXME i18n */}
            <h2 className='type_heading'>U kategoriji: {type}</h2>
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
                    onClick={() => setLength(length + 3)}
                    className='load_more_button'
                >
                    {/* FIXME i18n */}
                    Load more
                </button>
            )}
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
