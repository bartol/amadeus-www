import React, { useContext } from 'react';
import { graphql } from 'gatsby';
import { SharedContext } from '../state/shared';
import { Layout } from '../components/layout';
import { Breadcrumbs } from '../components/breadcrumbs';
import { ItemImages } from '../components/itemImages';
import { cart } from '../locales';
import { Contact } from '../components/contact';

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
            <div className='item_content'>
                <Breadcrumbs
                    name={item.name}
                    type={item.type}
                    slug={item.slug}
                />
                <div className='item_details_wrapper'>
                    <ItemImages images={item.images} name={item.name} />
                    <section>
                        <h1>{item.name[language]}</h1>
                        <h3 className='availability'>
                            {item.availability[language]}
                        </h3>
                        <div className='item_params'>
                            {item.discountedPrice === item.price ? (
                                <h3>{convertToCurrency(item.price)}</h3>
                            ) : (
                                <h3 className='price_and_discount_item'>
                                    <strike>
                                        {convertToCurrency(item.price)}
                                    </strike>
                                    {convertToCurrency(item.discountedPrice)}
                                </h3>
                            )}
                            <h3 className='item_quantity'>
                                {getQuantity(item.id, item.quantity)} kom.
                            </h3>
                        </div>
                        {/* guarantee... */}
                        <button
                            type='button'
                            onClick={() =>
                                addToCart({
                                    name: item.name,
                                    price: item.price,
                                    discountedPrice: item.discountedPrice,
                                    quantity: item.quantity,
                                    availability: item.availability,
                                    image:
                                        item.images[0].optimized.childImageSharp
                                            .fixed,
                                    id: item.id,
                                })
                            }
                            disabled={getQuantity(item.id, item.quantity) === 0}
                            className='add_to_cart_button'
                        >
                            {cart[language].addToCard}
                        </button>
                    </section>
                </div>
                <div className='description_and_recommended'>
                    <section
                        dangerouslySetInnerHTML={{
                            __html: item.description[language],
                        }}
                        className='description'
                    />
                    <aside className='recommended'>
                        {/* recommended items */}
                    </aside>
                </div>
                <div className='item_contact'>
                    <Contact />
                </div>
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
