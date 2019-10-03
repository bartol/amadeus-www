import React from 'react'
import Footer from './footer'
import Header from './header'
import Cart from '../components/cart'

const Layout = ({ children }) => {
  return (
    <div className='text-gray-900 leading-normal'>
      <Header />
      <main className='container mx-auto'>{children}</main>
      <Footer />
      <Cart />
    </div>
  )
}

export default Layout
