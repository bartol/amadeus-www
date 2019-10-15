import React from 'react'
import { ApolloProvider as _ApolloProvider } from '@apollo/react-hooks'
import ApolloClient, { InMemoryCache } from 'apollo-boost'
import { persistCache } from 'apollo-cache-persist'
import fetch from 'isomorphic-fetch'
import { isBrowser } from '../helpers/isBrowser'

const cache = new InMemoryCache()

if (isBrowser()) {
  persistCache({
    cache,
    storage: window.localStorage,
  })
}

const client = new ApolloClient({
  uri: 'https://api.amadeus2.hr',
  cache,
  fetch,
})

export const ApolloProvider = ({ children }) => (
  <_ApolloProvider client={client}>{children}</_ApolloProvider>
)
