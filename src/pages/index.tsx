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
      <ul className='flex flex-wrap -mx-1'>
        {types.map(({ name, optimized }) => {
          const type = name.split('|||')[language === 'hr' ? 0 : 1]

          return (
            <li
              key={name}
              className='my-1 px-1 w-1/2 overflow-hidden md:w-1/4 h-16 sm:h-24 lg:h-32 relative radius-1'
            >
              <Link
                to={`${
                  language === 'hr' ? '/' : `/${language}/`
                }${type.toLowerCase()}/`}
              >
                <h2 className='absolute bottom-0 left-0 sm:ml-5 lg:ml-7 sm:mb-2 md:mb-4 lg:mb-3 xl:mb-2 z-10 text-xl sm:text-2xl lg:text-3xl text-white font-medium type-name'>
                  {type}
                </h2>
                <Image
                  fluid={optimized.childImageSharp.fluid}
                  alt={`Image of ${type}`}
                  loading='lazy'
                  className='object-cover type-img'
                  fadeIn
                />
              </Link>
            </li>
          )
        })}
      </ul>
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
              fluid(maxWidth: 1200, maxHeight: 400) {
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
      banners: {
        desktop: BannerImage[]
        mobile: BannerImage[]
      }
      types: TypeImage[]
    }
  }
}

interface BannerImage {
  link: string
  src: string
  optimized: OptimizedImage
}

interface TypeImage {
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
