import React from 'react'
import { graphql } from 'gatsby'
import Layout from '../components/layout'

const Type: React.FC = ({ data, pageContext }) => {
  const { language, type } = pageContext
  const items = data.amadeus.items.filter(item => item.type[language] === type)

  return (
    <Layout
      language={language}
      newUrl={
        language === 'hr'
          ? `/en/${items[0].type.en.toLowerCase()}/`
          : `/${items[0].type.hr.toLowerCase()}/`
      }
    >
      <pre>{JSON.stringify(items, null, 2)}</pre>
    </Layout>
  )
}

export default Type

export const pageQuery = graphql`
  {
    amadeus {
      items {
        name {
          hr
          en
        }
        type {
          hr
          en
        }
        price
        slug
        id
        quantity
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
    }
  }
`

interface Props {
  data: {
    amadeus: {
      item: Item
    }
  }
}

interface Item {
  name: string
  price: number
  description: string
  quantity: number
  availability: string
  images: string[]
  optimizedImages: OptimizedImage[]
}

interface OptimizedImage {
  childImageSharp: {
    fluid: {
      tracedSVG: string
      aspectRatio: number
      src: string
      srcSet: string
      srcWebp: string
      srcSetWebp: string
      sizes: string
    }
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
