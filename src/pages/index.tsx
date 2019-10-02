import { graphql } from 'gatsby'
import React, { useContext } from 'react'
import { CartContext } from '../state/global'
import Card from '../components/card'
import Cart from '../components/cart'
import Layout from '../components/layout'
import '../styles/custom.css'

const index: React.FC<Props> = ({ data }) => {
  const { items } = data.amadeus
  const { cartContents } = useContext(CartContext)
  return (
    <Layout>
      <Cart />
      <pre>{JSON.stringify(cartContents, null, 2)}</pre>
      <ul className='flex mb-4'>
        {items.map(item => {
          const { name, price, slug, optimizedImages } = item
          return (
            <Card
              name={name}
              slug={slug}
              price={price}
              optimizedImage={optimizedImages[0]}
              key={slug}
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
