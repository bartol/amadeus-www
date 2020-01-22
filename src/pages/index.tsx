import * as React from 'react'
import { useState, useContext } from 'react'
import { Link, graphql } from 'gatsby'
import Image from 'gatsby-image'
import InfiniteScroll from 'react-infinite-scroller'
import Card from '../components/card'
import Layout from '../components/layout'
import '../styles/custom.css'
import Banner from '../components/banner'
import { SearchContext } from '../state/global'

const Index: React.FC<Props> = ({ data, pageContext }) => {
  const { language } = pageContext
  const {
    results,
    mainListBrand,
    mainListBrands,
    mainListResults,
    setMainListBrand,
  } = useContext(SearchContext)

  const [length, setLength] = useState(4)

  const { types, banners } = data.amadeus

  return (
    <Layout language={language}>
      <Banner banners={banners} />
      <div className='flex flex-col lg:flex-row'>
        <div className='w-full lg:w-1/6'>
          <ul>
            {mainListBrands.map(({ value, count }) => {
              return (
                <li
                  key={value}
                  onClick={() => {
                    if (mainListBrand === value) {
                      setMainListBrand('')
                    } else {
                      setMainListBrand(value)
                    }
                  }}
                  style={{
                    backgroundColor:
                      mainListBrand === value ? 'rebeccapurple' : null,
                  }}
                >
                  {value} ({count})
                </li>
              )
            })}
          </ul>
        </div>
        <InfiniteScroll
          pageStart={0}
          loadMore={() => {
            setLength(length + 3)
          }}
          hasMore={length < results.length}
          className='lg:flex-grow'
        >
          <ul className='flex flex-wrap -m-2'>
            {mainListResults.map(item => {
              const {
                name,
                price,
                type,
                quantity,
                slug,
                images,
                id,
                availability,
                hidden,
              } = item.item || item

              return (
                <Card
                  name={name}
                  slug={slug}
                  type={type}
                  price={price}
                  quantity={quantity}
                  availability={availability[language]}
                  image={images[0]}
                  id={id}
                  key={id}
                  language={language}
                  hidden={hidden}
                />
              )
            })}
          </ul>
        </InfiniteScroll>
      </div>
      <ul>
        {types.map(({ name, optimized }) => {
          const type = name.split('|||')[language === 'hr' ? 0 : 1]

          return (
            <li key={name}>
              <Link
                to={`${
                  language === 'hr' ? '/' : `/${language}/`
                }${type.toLowerCase()}/`}
              >
                {type}
                <Image
                  fluid={optimized.childImageSharp.fluid}
                  alt={`Image of ${type}`}
                  loading='lazy'
                  fadeIn
                />
              </Link>
            </li>
          )
        })}
      </ul>
    </Layout>
  )
}

export default Index

export const query = graphql`
  {
    amadeus {
      types {
        name
        src
        optimized {
          childImageSharp {
            # fix this
            fluid(maxWidth: 200, maxHeight: 100) {
              ...GatsbyImageSharpFluid_withWebp_tracedSVG
            }
          }
        }
      }
      banners {
        desktop {
          src
          link
          optimized {
            childImageSharp {
              fluid(maxWidth: 1280, maxHeight: 425) {
                ...GatsbyImageSharpFluid_withWebp_tracedSVG
              }
            }
          }
        }
        mobile {
          src
          link
          optimized {
            childImageSharp {
              fluid(maxWidth: 640, maxHeight: 480) {
                ...GatsbyImageSharpFluid_withWebp_tracedSVG
              }
            }
          }
        }
      }
    }
  }
`

interface Props {
  pageContext: {
    language: string
  }
  data: {
    amadeus: {
      banners: Banner[]
      types: Type[]
    }
  }
}

interface Banner {
  link: string
  src: string
  optimized: OptimizedImage
}

interface Type {
  name: string
  src: string
  optimized: OptimizedImage
}

interface OptimizedImage {
  childImageSharp: {
    fluid: {
      aspectRatio: number
      src: string
      srcSet: string
      sizes: string
      base64?: string
      tracedSVG?: string
      srcWebp?: string
      srcSetWebp?: string
      media?: string
    }
  }
}
