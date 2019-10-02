import React from 'react'
import { CartProvider } from './cart'
import { ApolloProvider } from './apollo-client'

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
        <ApolloProvider key='ApolloProvider' />,
        <CartProvider key='CartProvider' />,
      ]}
    >
      {children}
    </ProviderComposer>
  )
}
