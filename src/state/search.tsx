import React, { useState, useEffect, createContext } from 'react'
import { navigate } from '@reach/router'
import Fuse from 'fuse.js'
import { urlToState } from '../helpers/urlToState'
import { stateToUrl } from '../helpers/stateToUrl'
import { isBrowser } from '../helpers/isBrowser'

export const SearchContext = createContext()

const DEBOUNCE_TIME = 400

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

export const SearchProvider = ({ children }) => {
  // eslint-disable-next-line no-undef
  const location = isBrowser() ? window.location : undefined

  const [allResults, setAllResults] = useState([])
  const [results, setResults] = useState([])
  const [allCategories, setAllCategories] = useState([])
  const [categories, setCategories] = useState([])
  const [query, setQuery] = useState(urlToState(location).q)
  const [category, setCategory] = useState(urlToState(location).category)
  const [sort, setSort] = useState(urlToState(location).sort)
  const [debouncedSetResults, setDebouncedSetResults] = useState(null)

  useEffect(() => {
    // if (sort === 'popular') {
    //   allResults.sort((a, b) => {
    //     return b.fields.views - a.fields.views
    //   })
    // } else if (sort === 'oldest') {
    //   allResults.sort((a, b) => {
    //     return a.fields.timestamp - b.fields.timestamp
    //   })
    // } else if (sort === 'alphabetical') {
    //   allResults.sort((a, b) => {
    //     return a.frontmatter.title.localeCompare(b.frontmatter.title)
    //   })
    // } else if (sort === 'unalphabetical') {
    //   allResults.sort((a, b) => {
    //     return b.frontmatter.title.localeCompare(a.frontmatter.title)
    //   })
    // } else {
    //   allResults.sort((a, b) => {
    //     return b.fields.timestamp - a.fields.timestamp
    //   })
    // }

    const filtered = category
      ? allResults.filter(result => result.category.includes(category))
      : []

    const list = filtered.length ? filtered : allResults

    const fuse = new Fuse(list, options)

    setResults(query ? fuse.search(query) : list)
  }, [allResults, query, category, sort])

  const params = {
    query,
    category,
    sort,
  }

  useEffect(() => {
    clearTimeout(debouncedSetResults)

    setDebouncedSetResults(
      setTimeout(() => {
        navigate(stateToUrl(location, params), {
          replace: true,
        })
      }, DEBOUNCE_TIME)
    )
  }, [query])

  useEffect(() => {
    navigate(stateToUrl(location, params), {
      replace: true,
    })
  }, [category, sort])

  useEffect(() => {
    const allItemsCategories = results.map(item => {
      const itemNormalized = item.item || item
      return itemNormalized.category
    })

    const filteredCategories = []
    allItemsCategories.forEach(itemCategories => {
      itemCategories.forEach(category => {
        const match = filteredCategories.filter(c => c.value === category)
        if (match.length) {
          return match[0].count++
        }

        filteredCategories.push({
          value: category,
          count: 1,
        })
      })
    })

    setCategories(filteredCategories)
  }, [query])

  useEffect(() => {
    const allItemsCategories = allResults.map(item => item.category)

    setAllCategories([...new Set([].concat(...allItemsCategories))])
  }, [allResults])

  return (
    <SearchContext.Provider
      value={{
        setAllResults,
        results,
        allCategories,
        categories,
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
