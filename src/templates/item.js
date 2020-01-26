import React, { useContext } from 'react';
import { graphql } from 'gatsby';
import { SharedContext } from '../state/shared';
import { Layout } from '../components/layout';
import { Breadcrumbs } from '../components/breadcrumbs';
import { ItemImages } from '../components/itemImages';
import { cart } from '../locales';

const Item = ({ data, pageContext }) => {
    const { language } = pageContext;
    const { item } = data.amadeus;

    const { getQuantity, convertToCurrency, addToCart } = useContext(
        SharedContext
    );

    return (
        <Layout
            language={language}
            changeLanguageCustomUrl={{
                hr: `/${item.type.hr.toLowerCase()}/${item.slug}/`,
                en: `/en/${item.type.en.toLowerCase()}/${item.slug}/`,
            }}
        >
            <Breadcrumbs name={item.name} type={item.type} slug={item.slug} />
            <div>
                <ItemImages images={item.images} name={item.name} />
                <section>
                    <h1>{item.name[language]}</h1>
                    <h3>{getQuantity(item.id, item.quantity)}</h3>
                    {/* availability */}
                    <h2>{convertToCurrency(item.price)}</h2>
                    <h2>{convertToCurrency(item.discountedPrice)}</h2>
                    {/* guarantee... */}
                    <button
                        type='button'
                        onClick={() =>
                            addToCart({
                                name: item.name,
                                price: item.discountedPrice,
                                quantity: item.quantity,
                                availability: item.availability,
                                image: item.images[0].optimized.fixed,
                                id: item.id,
                            })
                        }
                        disabled={getQuantity(item.id, item.quantity) === 0}
                    >
                        {cart[language].addToCard}
                    </button>
                </section>
            </div>
            <div>
                <section
                    dangerouslySetInnerHTML={{
                        __html: item.description[language],
                    }}
                />
                <aside>{/* recommended items */}</aside>
            </div>
        </Layout>
    );
};

export default Item;

export const itemQuery = graphql`
    query itemQuery($id: ID!) {
        amadeus {
            item(id: $id) {
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
                description {
                    hr
                    en
                }
                images {
                    index
                    src
                    optimized {
                        childImageSharp {
                            # carousel
                            fluid(maxWidth: 800, maxHeight: 600) {
                                ...GatsbyImageSharpFluid_withWebp
                            }
                            # dots and cart
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
