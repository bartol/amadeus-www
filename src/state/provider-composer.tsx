import React from 'react'
import { ApolloProvider } from './apollo-client'
import { CartProvider } from './cart'
import { CheckoutProvider } from './checkout'
import { I18nProvider } from './i18n'
import { SearchProvider } from './search'

const ProviderComposer = ({ contexts, children }) => {
  return contexts.reduceRight(
    (kids, parent) =>
      React.cloneElement(parent, {
        children: kids,
      }),
    children
  )
}

export const ContextProvider = ({ children }) => {
  return (
    <ProviderComposer
      contexts={[
        <ApolloProvider key='apollo' />,
        <CartProvider key='cart' />,
        <CheckoutProvider key='checkout' />,
        <I18nProvider key='i18n' />,
        <SearchProvider key='search' />,
      ]}
    >
      {children}
    </ProviderComposer>
  )
}
