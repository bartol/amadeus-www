import React, { useState, useEffect } from 'react'
import { useStaticQuery, graphql, Link } from 'gatsby'
import Fuse from 'fuse.js'
import { connect } from 'react-redux'
import CartImage from '../cart/cartImage'
// @ts-ignore
import { addToCart as reduxAddToCart } from '../../state/actions'

const Search = ({ opened, toggleCart, addToCart }: any) => {
  const data = useStaticQuery(graphql`
    {
      allItems {
        nodes {
          name
          slug
          price
          id__normalized
          qt
          desc
        }
      }
    }
  `)

  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])

  const items = data.allItems.nodes

  const options = {
    shouldSort: true,
    includeScore: true,
    includeMatches: true,
    threshold: 0.33,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 2,
    keys: [{ name: 'name', weight: 1 }, { name: 'desc', weight: 0.75 }]
  }

  useEffect(() => {
    const fuse = new Fuse(items, options)

    setResults(query ? fuse.search(query) : items)
  }, [query])

  return (
    <div
      className={`instantsearch ${opened ? 'open' : 'close'}`}
      onClick={() => (opened ? toggleCart() : null)}
      role="presentation"
    >
      <form
        noValidate
        action=""
        role="search"
        onSubmit={event => event.preventDefault()}
      >
        <input
          type="search"
          value={query}
          className="search"
          onChange={event => setQuery(event.currentTarget.value)}
          placeholder="Search items"
          aria-label="Search items"
        />
      </form>
      {results.length ? (
        <ul className="list">
          {results.map((item: any) => {
            // fuse returns object with item property instead of original object
            const { name, slug, price } = item.item || item
            return (
              <li key={slug}>
                <CartImage ImageKey={`${slug}-1`} />
                <Link to={`/${slug}/`} key={slug}>
                  <h3>{name}</h3>
                </Link>
                {price / 100} kn
                <button type="button" onClick={() => addToCart(item)}>
                  Add to cart
                </button>
              </li>
            )
          })}
        </ul>
      ) : null}
      {!results.length && query ? <h2>No results</h2> : null}
    </div>
  )
}

// export default Search
export default connect(
  null,
  { addToCart: reduxAddToCart }
)(Search)
