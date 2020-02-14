import React, { useState, useEffect } from 'react';
import { graphql } from 'gatsby';
import { Layout } from '../components/layout';
import { Banners } from '../components/banners';
import { Card } from '../components/card';
import { FeaturedItems } from '../components/featuredItems';
import { Contact } from '../components/contact';

const Index = ({ pageContext, data }) => {
    const { language } = pageContext;
    const { items, banners, featuredItems } = data.amadeus;

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
        <Layout language={language}>
            <Banners banners={banners} />
            <FeaturedItems items={featuredItems} />
            <Contact />
            <ul>
                {brands.map(brand => {
                    return (
                        <li
                            onClick={() =>
                                brand.name !== selectedBrand
                                    ? setSelectedBrand(brand.name)
                                    : setSelectedBrand('')
                            }
                            key={brand.name}
                        >
                            {brand.name} ({brand.count})
                        </li>
                    );
                })}
            </ul>
            <ul>
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
                <button type='button' onClick={() => setLength(length + 3)}>
                    {/* FIXME i18n */}
                    Load more
                </button>
            )}
        </Layout>
    );
};

export default Index;

export const indexQuery = graphql`
    query indexQuery {
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
            banners {
                desktop {
                    link {
                        hr
                        en
                    }
                    src
                    optimized {
                        childImageSharp {
                            fluid(maxWidth: 1280, maxHeight: 430) {
                                ...GatsbyImageSharpFluid_withWebp
                            }
                        }
                    }
                }
                mobile {
                    link {
                        hr
                        en
                    }
                    src
                    optimized {
                        childImageSharp {
                            fluid(maxWidth: 640, maxHeight: 480) {
                                ...GatsbyImageSharpFluid_withWebp
                            }
                        }
                    }
                }
            }
            featuredItems {
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
