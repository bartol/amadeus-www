import React, { useContext } from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { Helmet } from 'react-helmet';
import { SharedContext } from '../state/shared';
import { Header } from './header';
import { Head } from './head';
import { Footer } from './footer';
import { Search } from './search';
import { Cart } from './cart';

export const Layout = ({ children, language, changeLanguageCustomUrl }) => {
    const { setLanguage, setCurrencyData, setSearchData } = useContext(
        SharedContext
    );

    const data = useStaticQuery(graphql`
        query dataQuery {
            amadeus {
                exchangeRates {
                    EUR
                    BAM
                    RSD
                    USD
                    GBP
                }
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
                    description {
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
    `);

    setLanguage(language);
    setCurrencyData(data.amadeus.exchangeRates);
    setSearchData(data.amadeus.items);

    return (
        <>
            <Helmet defer={false}>
                <meta name='robots' content='index, follow' />
            </Helmet>
            <Head />
            <div className='container'>
                <Header changeLanguageCustomUrl={changeLanguageCustomUrl} />
                <main>{children}</main>
            </div>
            <Footer />
            <Search />
            <Cart />
        </>
    );
};
