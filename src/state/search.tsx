import React, { useState, useEffect, createContext } from 'react'
import Fuse from 'fuse.js'
import { urlToState } from '../helpers/urlToState'

export const SearchContext = createContext()

export const SearchProvider = ({ children }) => {
  const [allResults, setAllResults] = useState([])
  const [results, setResults] = useState([])
  const [query, setQuery] = useState(urlToState().q)
  const [category, setCategory] = useState(urlToState().category)
  const [sort, setSort] = useState(urlToState().sort)

  const options = {
    shouldSort: true,
    includeScore: true,
    includeMatches: true,
    threshold: 0.33,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 2,
    keys: [
      { name: 'name', weight: 1 },
      { name: 'category', weight: 0.75 },
      { name: 'description', weight: 0.75 },
      { name: 'id', weight: 0.5 },
    ],
  }

  useEffect(() => {
    setResults(allResults)
  }, [allResults])

  useEffect(() => {
    const fuse = new Fuse(allResults, options)
    setResults(query ? fuse.search(query) : allResults)
  }, [query, category, sort])

  return (
    <SearchContext.Provider
      value={{
        setAllResults,
        results,
        query,
        setQuery,
        category,
        setCategory,
        sort,
        setSort,
      }}
    >
      {children}
    </SearchContext.Provider>
  )
}
