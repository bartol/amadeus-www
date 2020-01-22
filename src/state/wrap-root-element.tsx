import * as React from 'react'
import { CartProvider } from './cart'
import { CheckoutProvider } from './checkout'
import { I18nProvider } from './i18n'
import { SearchProvider } from './search'

export const wrapRootElement = ({ element }) => {
  return (
    <I18nProvider>
      <CartProvider>
        <CheckoutProvider>
          <SearchProvider>{element}</SearchProvider>
        </CheckoutProvider>
      </CartProvider>
    </I18nProvider>
  )
}
