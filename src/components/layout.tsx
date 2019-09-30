import React from 'react'
import Footer from './footer'
import Header from './header'

const Layout = ({ children }) => {
  return (
    <div className='text-gray-900 leading-normal'>
      <Header />
      <main className='container mx-auto'>{children}</main>
      <Footer />
    </div>
  )
}

export default Layout
