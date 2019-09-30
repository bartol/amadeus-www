import { graphql, Link } from 'gatsby'
import Image from 'gatsby-image'
import React from 'react'

const index: React.FC<Props> = ({ data }) => {
  const { items } = data.amadeus
  return (
    <div>
      <h1>amadeus2.hr</h1>
      <ul>
        {items.map(item => {
          const { name, price, slug, optimizedImages } = item
          return (
            <li key={slug}>
              <Link to={`/${slug}/`}>
                <h2>{name}</h2>
              </Link>
              <h3>{price / 100} kn</h3>
              {optimizedImages.map(optimizedImage => {
                return (
                  <Image
                    fixed={optimizedImage.childImageSharp.fixed}
                    key={optimizedImage.childImageSharp.fixed.src}
                    alt={name}
                  />
                )
              })}
            </li>
          )
        })}
      </ul>
    </div>
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
