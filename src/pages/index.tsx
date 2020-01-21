import * as React from 'react'
import { useState, useContext } from 'react'
import { Link, graphql } from 'gatsby'
import InfiniteScroll from 'react-infinite-scroller'
import Card from '../components/card'
import Layout from '../components/layout'
import '../styles/custom.css'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import Banner from '../components/banner'
import { SearchContext } from '../state/global'

const ITEMS_QUERY = gql`
  query ItemsQuery {
    items {
      id
      price
      quantity
      availability {
        hr
        en
      }
    }
  }
`

const Index: React.FC<Props> = ({ data, pageContext }) => {
  const { language } = pageContext
  const {
    results,
    categories,
    allCategories,
    setCategories,
    allResults,
    query,
  } = useContext(SearchContext)

  const [length, setLength] = useState(4)

  const { banners } = data.amadeus

  const { data: runTimeData } = useQuery(ITEMS_QUERY, {
    fetchPolicy: 'cache-and-network',
  })
  const runTimeItems = runTimeData ? runTimeData.items : []

  const types = []
  allResults.forEach(item => {
    const typeIndex = types.findIndex(t => t.name === item.type[language])

    if (typeIndex === -1) {
      types.push({
        name: item.type[language],
        count: 1,
      })
    } else {
      types[typeIndex].count++
    }
  })
  types.sort((a, b) => b.count - a.count).slice(0, 10)

  return (
    <Layout language={language}>
      <section className='w-full' hidden={!!query}>
        <Banner banners={banners} />
      </section>
      <div className='flex'>
        {!query && (
          <div className='w-1/6'>
            <ul>
              {allCategories.brand.map(({ value, count }) => {
                return (
                  <li
                    key={value}
                    onClick={() => {
                      if (categories.brand === value) {
                        setCategories({
                          ...categories,
                          brand: '',
                        })
                      } else {
                        setCategories({
                          ...categories,
                          brand: value,
                        })
                      }
                    }}
                    style={{
                      backgroundColor:
                        categories.brand === value ? 'rebeccapurple' : null,
                    }}
                  >
                    {value} ({count})
                  </li>
                )
              })}
            </ul>
          </div>
        )}
        {query && (
          <div className='w-1/6'>
            <h3 className='text-2xl'>Kategorije</h3>
            <ul>
              {allCategories.type.map(({ value, count }) => {
                return (
                  <li
                    key={value}
                    onClick={() => {
                      if (categories.type === value[language]) {
                        setCategories({
                          ...categories,
                          type: '',
                        })
                      } else {
                        setCategories({
                          ...categories,
                          type: value[language],
                        })
                      }
                    }}
                    style={{
                      backgroundColor:
                        categories.type === value[language]
                          ? 'rebeccapurple'
                          : null,
                    }}
                  >
                    {value[language]} ({count})
                  </li>
                )
              })}
            </ul>
            <h3 className='text-2xl'>Brendovi</h3>
            <ul>
              {allCategories.brand.map(({ value, count }) => {
                return (
                  <li
                    key={value}
                    onClick={() => {
                      if (categories.brand === value) {
                        setCategories({
                          ...categories,
                          brand: '',
                        })
                      } else {
                        setCategories({
                          ...categories,
                          brand: value,
                        })
                      }
                    }}
                    style={{
                      backgroundColor:
                        categories.brand === value ? 'rebeccapurple' : null,
                    }}
                  >
                    {value} ({count})
                  </li>
                )
              })}
            </ul>
          </div>
        )}
        {results.length && (
          <InfiniteScroll
            pageStart={0}
            loadMore={() => {
              setLength(length + 3)
            }}
            hasMore={length < results.length}
          >
            <ul className='flex mb-4 w-5/6'>
              {results.map(item => {
                const {
                  name,
                  price,
                  type,
                  quantity,
                  slug,
                  optimizedImages,
                  id,
                  availability,
                  hidden,
                } = item.item || item

                const runTimeItem = runTimeItems.length
                  ? runTimeItems.find(i => i.id === id)
                  : {}

                return (
                  <Card
                    name={name}
                    slug={slug}
                    type={type}
                    price={runTimeItem.price || price}
                    quantity={runTimeItem.quantity || quantity}
                    availability={
                      runTimeItem.availability
                        ? runTimeItem.availability[language]
                        : availability[language]
                    }
                    optimizedImage={optimizedImages[0]}
                    optimizedImages={optimizedImages}
                    id={id}
                    key={id}
                    language={language}
                    hidden={hidden}
                  />
                )
              })}
            </ul>
          </InfiniteScroll>
        )}
      </div>
      <div>
        {types.map(type => {
          return (
            <li key={type.name}>
              <Link
                to={`${language === 'hr' ? '/' : `/${language}/`}${type.name}/`}
              >
                {type.name} {type.count}
              </Link>
            </li>
          )
        })}
      </div>
      <pre>{JSON.stringify(allCategories, null, 2)}</pre>
      <pre>{JSON.stringify(categories, null, 2)}</pre>
      {query && !results.length ? <h2>No results</h2> : null}
    </Layout>
  )
}

export default Index

export const query = graphql`
  {
    amadeus {
      items {
        name {
          hr
          en
        }
        price
        slug
        id
        quantity
        type {
          hr
          en
        }
        availability {
          hr
          en
        }
        images {
          src
          index
        }
        optimizedImages {
          childImageSharp {
            fluid(maxWidth: 240, maxHeight: 180) {
              ...GatsbyImageSharpFluid_withWebp_tracedSVG
            }
          }
        }
      }
      banners {
        desktop
        optimizedDesktop {
          childImageSharp {
            fluid(maxWidth: 1024, maxHeight: 340) {
              ...GatsbyImageSharpFluid_withWebp_tracedSVG
            }
          }
        }
        mobile
        optimizedMobile {
          childImageSharp {
            fluid(maxWidth: 767, maxHeight: 575) {
              ...GatsbyImageSharpFluid_withWebp_tracedSVG
            }
          }
        }
      }
    }
  }
`

interface Props {
  data: {
    amadeus: {
      items: Item[]
    }
  }
}

interface Item {
  name: string
  price: number
  slug: string
  images: string[]
  optimizedImages: OptimizedImage[]
}

interface OptimizedImage {
  childImageSharp: {
    fluid: {
      tracedSVG: string
      width: number
      height: number
      src: string
      srcSet: string
      srcWebp: string
      srcSetWebp: string
    }
  }
}
