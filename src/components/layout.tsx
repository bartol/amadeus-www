import * as React from 'react'
import { useContext } from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import { I18nContext, SearchContext } from '../state/global'
import Footer from './footer'
import Header from './header'
import Cart from '../components/cart'

const Layout: React.FC<Props> = ({ children, language, newUrl }) => {
  const { setExchangeRatesData } = useContext(I18nContext)
  const { setAllResults, setLanguage } = useContext(SearchContext)
  const data = useStaticQuery(graphql`
    query staticQuery {
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
          description {
            hr
            en
          }
          id
          price
          discountedPrice
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
          slug
          images {
            src
            index
            optimized {
              childImageSharp {
                fluid(maxWidth: 240, maxHeight: 180) {
                  ...GatsbyImageSharpFluid_withWebp_tracedSVG
                }
              }
            }
          }
          hidden
        }
      }
    }
  `)
  const { exchangeRates, items } = data.amadeus
  setExchangeRatesData(exchangeRates)
  setAllResults(items)
  setLanguage(language)

  return (
    <div className='text-gray-900 leading-normal container mx-auto'>
      <Header language={language} newUrl={newUrl} />
      <main>{children}</main>
      <Footer />
      <Cart language={language} />
    </div>
  )
}

export default Layout

interface Props {
  language: string
  newUrl?: string
}
