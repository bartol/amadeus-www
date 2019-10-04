import React, { useContext } from 'react'
import { header } from '../locales'
import { I18nContext } from '../state/global'

const Header = () => {
  const { language, changeLanguage, currency, changeCurrency } = useContext(
    I18nContext
  )
  return (
    <nav className='container mx-auto flex justify-between'>
      <h1 className='text-3xl'>Amadeus</h1>
      <input
        type='text'
        className='text-3xl bg-gray-200 rounded-lg focus:outline-none px-3 w-1/2'
        placeholder={header[language].searchPlaceholder}
      />
      <h3 className='text-3xl'>{header[language].cart}</h3>
      {currency}
      <select onChange={e => changeLanguage(e.target.value)}>
        <option value='hr'>Hrvatski</option>
        <option value='en'>English</option>
      </select>
      <select onChange={e => changeCurrency(e.target.value)}>
        <option value='HRK'>HRK</option>
        <option value='EUR'>EUR</option>
        <option value='BAM'>BAM</option>
        <option value='RSD'>RSD</option>
        <option value='USD'>USD</option>
        <option value='GBP'>GBP</option>
      </select>
    </nav>
  )
}

export default Header
