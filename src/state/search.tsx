import React, { useState, useEffect, createContext } from 'react'
import { navigate } from '@reach/router'
import * as Fuse from 'fuse.js'
import { urlToState } from '../helpers/urlToState'
import { stateToUrl } from '../helpers/stateToUrl'
import { isBrowser } from '../helpers/isBrowser'

export const SearchContext = createContext()

const DEBOUNCE_TIME = 400

const calculateCategories = results => {
  const allItemsCategories = results.map(item => {
    const { type, brand, price } = item.item || item
    return { type, brand, price }
  })

  const brand = []
  const type = []
  const price = {
    min: 0,
    max: 0,
  }
  allItemsCategories.forEach(itemCategory => {
    const { type: itemType, brand: itemBrand, price: itemPrice } = itemCategory

    const brandIndex = brand.findIndex(b => b.value === itemBrand)

    if (brandIndex === -1) {
      brand.push({
        value: itemBrand,
        count: 1,
      })
    } else {
      brand[brandIndex].count++
    }

    const typeIndex = type.findIndex(t => t.value === itemType)

    if (typeIndex === -1) {
      type.push({
        value: itemType,
        count: 1,
      })
    } else {
      type[typeIndex].count++
    }

    if (!price.min || itemPrice < price.min) price.min = itemPrice
    if (!price.max || itemPrice > price.max) price.max = itemPrice
  })

  return {
    brand,
    type,
    price,
  }
}

export const SearchProvider = ({ children }) => {
  // eslint-disable-next-line no-undef
  const location = isBrowser() ? window.location : undefined
  const [language, setLanguage] = useState('hr')

  const [allResults, setAllResults] = useState([])
  const [results, setResults] = useState([])
  const [query, setQuery] = useState(urlToState(location))
  const [allCategories, setAllCategories] = useState({
    brand: [],
    type: [],
    price: { min: 0, max: 0 },
  })
  const defaultCategories = {
    brand: '',
    type: '',
    price: { min: 0, max: 0 },
  }
  const [categories, setCategories] = useState(defaultCategories)
  const [sort, setSort] = useState('recent')
  const [debouncedSetResults, setDebouncedSetResults] = useState(null)

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
      { name: `name.${language}`, weight: 1 },
      { name: 'id', weight: 1 },
      { name: 'brand', weight: 0.85 },
      { name: `type.${language}`, weight: 0.85 },
      { name: `description.${language}`, weight: 0.7 },
    ],
  }

  const fuse = new Fuse(allResults, options)

  useEffect(() => {
    setResults(query ? fuse.search(query).map(i => i.item) : allResults)
    if (categories.brand || categories.type || categories.price) {
      setCategories(defaultCategories)
    }
  }, [allResults, query])

  useEffect(() => {
    const { type, brand, price } = categories
    const data = results.map(result => {
      // console.log(result.name, 'has type', type === result.type)
      // console.log(result.name, 'has brand', brand === result.brand)
      // console.log(
      // result.name,
      // 'is in price range',
      // price.min < result.price && price.max > result.price
      // )

      if (
        (type && type !== result.type[language]) ||
        (brand && brand !== result.brand) ||
        (price.min && price.min > result.price) ||
        (price.max && price.max < result.price)
      ) {
        result.hidden = true
      } else {
        result.hidden = false
      }

      return result
    })
    // data.forEach(d => {
    // console.log(d.name, 'is hidden', d.hidden)
    // })
    // console.log('')
    // console.log('')
    // console.log('')
    setResults(data)
  }, [categories])

  useEffect(() => {
    setAllCategories(calculateCategories(results))
  }, [results])

  // update url
  useEffect(() => {
    clearTimeout(debouncedSetResults)

    setDebouncedSetResults(
      setTimeout(() => {
        navigate(stateToUrl(location, { query }), {
          replace: true,
        })
      }, DEBOUNCE_TIME)
    )
  }, [query])

  return (
    <SearchContext.Provider
      value={{
        setAllResults,
        results,
        query,
        setQuery,
        allCategories,
        categories,
        setCategories,
        sort,
        setSort,
        setLanguage,
      }}
    >
      {children}
    </SearchContext.Provider>
  )
}
