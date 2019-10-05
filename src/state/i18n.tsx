import React, { useState, createContext } from 'react'
import { navigate } from '@reach/router'

export const I18nContext = createContext()

export const isBrowser = () => typeof window !== 'undefined'

export const I18nProvider = ({ children }) => {
  const [currency, setCurrency] = useState(
    // get currency from localstorage, if not found or ssr set to HRK
    isBrowser() ? window.localStorage.getItem('currency') || 'HRK' : 'HRK'
  )
  const [currencyData, setCurrencyData] = useState({})

  const changeLanguage = (_language: string) => {
    navigate(
      isBrowser() && window.location.pathname.startsWith('/en/')
        ? window.location.pathname.slice(3)
        : `/en${window.location.pathname}`,
      { replace: true }
    )
  }

  const changeCurrency = (currency: string) => {
    setCurrency(currency)
    isBrowser() && window.localStorage.setItem('currency', currency)
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
