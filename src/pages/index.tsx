import React, { useContext } from 'react'
import { graphql } from 'gatsby'
import Card from '../components/card'
import Layout from '../components/layout'
import '../styles/custom.css'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import Banner from '../components/banner'
import { SearchContext } from '../state/global'

const ITEM_QUERY = gql`
  {
    items {
      id
      price
      quantity
      availability
    }
  }
`

const Index: React.FC<Props> = ({ data, pageContext }) => {
  const { language } = pageContext
  const { results } = useContext(SearchContext)

  const { banners } = data.amadeus

  const { data: runTimeData } = useQuery(ITEM_QUERY, {
    fetchPolicy: 'cache-and-network',
  })
  const runTimeItems = runTimeData ? runTimeData.items : []

  return (
    <Layout language={language}>
      <Banner banners={banners} />
      <ul className='flex mb-4'>
        {results.map(item => {
          const {
            name,
            price,
            quantity,
            slug,
            optimizedImages,
            id,
            availability,
          } = item.item || item

          const runTimeItem = runTimeItems.length
            ? runTimeItems.find(i => i.id === id)
            : {}

          return (
            <Card
              name={name}
              slug={slug}
              price={runTimeItem.price || price}
              quantity={runTimeItem.quantity || quantity}
              availability={runTimeItem.availability || availability}
              optimizedImage={optimizedImages[0]}
              optimizedImages={optimizedImages}
              id={id}
              key={id}
              language={language}
            />
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
      items {
        name
        price
        slug
        id
        quantity
        availability
        images
        optimizedImages {
          childImageSharp {
            fixed(width: 240, height: 180) {
              ...GatsbyImageSharpFixed_withWebp_tracedSVG
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
    fixed: {
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
