import { graphql } from 'gatsby'
import React from 'react'
import Card from '../components/card'
import Layout from '../components/layout'
import '../styles/custom.css'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

const APOLLO_QUERY = gql`
  {
    currency {
      HRK
      BAM
      RSD
      EUR
      USD
      GBP
    }
  }
`

const index: React.FC<Props> = ({ data, pageContext }) => {
  const { language } = pageContext
  const { items } = data.amadeus

  const { data: apollodata } = useQuery(APOLLO_QUERY)
  return (
    <Layout language={language}>
      <ul className='flex mb-4'>
        <div hidden>{JSON.stringify(apollodata)}</div>
        {items.map(item => {
          const { name, price, slug, optimizedImages } = item
          return (
            <Card
              name={name}
              slug={slug}
              price={price}
              optimizedImage={optimizedImages[0]}
              item={item}
              key={slug}
              language={language}
            />
          )
        })}
      </ul>
    </Layout>
  )
}

export default index

export const query = graphql`
  {
    amadeus {
      items {
        name
        price
        slug
        id
        quantity
        images
        optimizedImages {
          childImageSharp {
            fixed(width: 250, height: 250) {
              ...GatsbyImageSharpFixed_withWebp_tracedSVG
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
