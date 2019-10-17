import React, { useContext } from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import { I18nContext, SearchContext } from '../state/global'
import Footer from './footer'
import Header from './header'
import Cart from '../components/cart'

const Layout = ({ children, language }) => {
  const { setExchangeRatesData } = useContext(I18nContext)
  const { setAllResults } = useContext(SearchContext)
  const data = useStaticQuery(graphql`
    {
      amadeus {
        exchangeRates {
          EUR
          BAM
          RSD
          USD
          GBP
        }
        items {
          name
          # category
          description
          id
          price
          quantity
          availability
          slug
          images
          optimizedImages {
            childImageSharp {
              fixed(width: 240, height: 180) {
                ...GatsbyImageSharpFixed_withWebp_tracedSVG
              }
            }
          }
        }
      }
    }
  `)
  const { exchangeRates, items } = data.amadeus
  setExchangeRatesData(exchangeRates)
  setAllResults(items)

  return (
    <div className='text-gray-900 leading-normal'>
      <Header language={language} />
      <main className='container mx-auto'>{children}</main>
      <Footer />
      <Cart />
    </div>
  )
}

export default Layout
