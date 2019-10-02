import React from 'react'
import { ApolloProvider as _ApolloProvider } from '@apollo/react-hooks'
import ApolloClient from 'apollo-boost'
import fetch from 'isomorphic-fetch'

export const client = new ApolloClient({
  uri: 'https://api.amadeus2.hr',
  fetch,
})

export const ApolloProvider = ({ children }) => (
  <_ApolloProvider client={client}>{children}</_ApolloProvider>
)
