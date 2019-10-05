import React, { useContext } from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import { I18nContext } from '../state/global'
import Footer from './footer'
import Header from './header'
import Cart from '../components/cart'

const Layout = ({ children, language }) => {
  const { setCurrencyData } = useContext(I18nContext)
  const data = useStaticQuery(graphql`
    {
      amadeus {
        currency {
          EUR
          BAM
          RSD
          USD
          GBP
        }
      }
    }
  `)
  setCurrencyData(data.amadeus.currency)

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
