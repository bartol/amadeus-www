import { graphql, Link } from 'gatsby'
import Image from 'gatsby-image'
import React from 'react'
import '../styles/custom.css'

const index: React.FC<Props> = ({ data }) => {
  const { items } = data.amadeus
  return (
    <div className='container mx-auto'>
      <h1 className='bg-blue-200 text-center text-2xl'>amadeus2.hr</h1>
      <ul>
        {items.map(item => {
          const { name, price, slug, optimizedImages } = item
          return (
            <li key={slug}>
              <Link to={`/${slug}/`}>
                <h2>{name}</h2>
              </Link>
              <h3 className='text-5xl'>{price / 100} kn</h3>
              {optimizedImages.map((optimizedImage, index) => {
                return (
                  <Image
                    fixed={optimizedImage.childImageSharp.fixed}
                    key={optimizedImage.childImageSharp.fixed.src}
                    alt={`Image ${index} of ${name}`}
                  />
                )
              })}
            </li>
          )
        })}
      </ul>
      <button className='btn btn-blue'>Button</button>
      <br />
      <button className='text-3xl py-2 px-6 rounded bg-green-400 hover:bg-green-500 active:bg-green-600 trans trans-bg focus:outline-none'>
        Kupi ovaj proizvod
      </button>
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
