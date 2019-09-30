import React from 'react'
import data from '../../data/header.json'

const Header = () => {
  return (
    <nav className='container mx-auto flex justify-between'>
      <h1 className='text-3xl'>Amadeus</h1>
      <input
        type='text'
        className='text-3xl bg-gray-200 rounded-lg focus:outline-none px-3 w-1/2'
        placeholder={data.searchPlaceholder}
      />
      <h3 className='text-3xl'>Cart</h3>
    </nav>
  )
}

export default Header
