import React from 'react';
import { graphql } from 'gatsby';
import { Layout } from '../components/layout';
import { Card } from '../components/card';

const Type = ({ data, pageContext }) => {
    const { language, type } = pageContext;

    const items = data.amadeus.items.filter(
        item => item.type[language] === type
    );

    return (
        <Layout
            language={language}
            changeLanguageCustomUrl={{
                hr: `/${items[0].type.hr.toLowerCase()}/`,
                en: `/en/${items[0].type.en.toLowerCase()}/`,
            }}
        >
            {/* TODO */}
            <ul>
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
                            hidden={item.hidden}
                            key={item.id}
                        />
                    );
                })}
            </ul>
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
