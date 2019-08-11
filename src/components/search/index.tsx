import React, { useState } from 'react'
import algoliasearch from 'algoliasearch/lite'
import {
  InstantSearch,
  Hits,
  connectSearchBox,
  connectStats
} from 'react-instantsearch-dom'
import { useStaticQuery, graphql } from 'gatsby'
import HitsPreview from './hitsPreview'
import ListAll from '../ListAll'

const searchClient = algoliasearch(
  'YMC567Y2Z5',
  '433ac749b039503ffe3f555236fdced1'
)

const SearchBox = ({
  currentRefinement,
  /* isSearchStalled, */ refine
}: any) => (
  <form
    noValidate
    action=""
    role="search"
    onSubmit={event => event.preventDefault()}
  >
    <input
      type="search"
      value={currentRefinement}
      className="search"
      onChange={(event: any) => refine(event.currentTarget.value)}
      placeholder="Search posts"
      aria-label="Search posts"
    />
    {/* {isSearchStalled ? <NoHits /> : ''} */}
  </form>
)

const CustomSearchBox = connectSearchBox(SearchBox)

const Search = () => {
  const data = useStaticQuery(graphql`
    {
      allItems {
        totalCount
      }
    }
  `)

  const itemsNum: number = data.allItems.totalCount

  const [hitsNum, setHitsNum] = useState(itemsNum)

  const CustomStats = connectStats(({ nbHits }: any) => {
    setHitsNum(nbHits)
    return <></>
  })

  return (
    <>
      <InstantSearch searchClient={searchClient} indexName="amadeus2.hr">
        <CustomSearchBox />
        <CustomStats />
        {/* hits: {hitsNum}
        items: {itemsNum} */}
        {hitsNum < itemsNum ? (
          <ul>
            <Hits hitComponent={HitsPreview} />
          </ul>
        ) : (
          <ListAll />
        )}
      </InstantSearch>
    </>
  )
}

export default Search
