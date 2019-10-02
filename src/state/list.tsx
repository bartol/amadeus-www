import React, { useState, createContext } from 'react'

export const ListContext = createContext()

export const ListProvider = ({ children }) => {
  const [allResults, setAllResults] = useState([])
  const [results, setResults] = useState([])
  const [category, setCategory] = useState(null)
  const [sort, setSort] = useState(null)

  return (
    <ListContext.Provider
      value={{
        allResults,
        setAllResults,
        results,
        setResults,
        category,
        setCategory,
        sort,
        setSort,
      }}
    >
      {children}
    </ListContext.Provider>
  )
}
