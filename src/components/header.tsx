import React, { useContext } from 'react'
import { Link } from 'gatsby'
import { header } from '../locales'
import { I18nContext, SearchContext } from '../state/global'

const Header = ({ language }) => {
  const { currency, changeLanguage, changeCurrency } = useContext(I18nContext)
  const { query, setQuery } = useContext(SearchContext)

  return (
    <nav className='container mx-auto flex justify-between my-4'>
      <Link to={language === 'hr' ? '/' : `/${language}/`}>
        <h1 className='text-3xl'>Amadeus</h1>
      </Link>
      <input
        type='text'
        value={query}
        onChange={e => setQuery(e.target.value)}
        className='text-3xl bg-gray-200 rounded-lg focus:outline-none px-3 w-1/2'
        placeholder={header[language].searchPlaceholder}
      />
      <h3 className='text-3xl'>{header[language].cart}</h3>
      <select
        onChange={e => changeLanguage(e.target.value)}
        defaultValue={language}
      >
        <option value='hr'>Hrvatski</option>
        <option value='en'>English</option>
      </select>
      <select value={currency} onChange={e => changeCurrency(e.target.value)}>
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
