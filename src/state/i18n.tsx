import React, { useState, createContext } from 'react'

export const I18nContext = createContext()

export const I18nProvider = ({ children }) => {
  const [language, setLanguage] = useState('hr')
  const [currency, setCurrency] = useState('HRK')

  const [currencyData, setCurrencyData] = useState({})

  const changeLanguage = (language: string) => {
    setLanguage(language)
    // save to local storage ...
    // change route
  }

  const changeCurrency = (currency: string) => {
    setCurrency(currency)
    // save to local storage ...
  }

  const currencyConversion = (price: number) => {
    const HRK = price / 100
    const { EUR, BAM, RSD, USD, GBP } = currencyData

    switch (currency) {
      case 'HRK':
        return `${HRK} kn`
      case 'EUR':
        return `€${(HRK * EUR).toFixed(2)}`
      case 'BAM':
        return `${(HRK * BAM).toFixed(2)} BAM`
      case 'RSD':
        return `${(HRK * RSD).toFixed(2)} RSD`
      case 'USD':
        return `$${(HRK * USD).toFixed(2)}`
      case 'GBP':
        return `£${(HRK * GBP).toFixed(2)}`
    }
  }

  return (
    <I18nContext.Provider
      value={{
        language,
        changeLanguage,
        currency,
        changeCurrency,
        setCurrencyData,
        currencyConversion,
      }}
    >
      {children}
    </I18nContext.Provider>
  )
}
