import { graphql } from 'gatsby'
import Image from 'gatsby-image'
import { CarouselProvider, Dot, Slide, Slider } from 'pure-react-carousel'
import 'pure-react-carousel/dist/react-carousel.es.css'
import React, { useContext } from 'react'
import { CartContext } from '../state/global'
import Layout from '../components/layout'

const Item: React.FC<Props> = ({ data }) => {
  const { item } = data.amadeus
  const {
    name,
    price,
    description,
    quantity,
    availability,
    optimizedImages,
    id,
  } = item

  const { addToCart, getQuantity } = useContext(CartContext)

  return (
    <Layout>
      <div className='flex'>
        <div className='lg:w-3/5 pr-4'>
          <CarouselProvider
            naturalSlideWidth={100}
            naturalSlideHeight={100}
            totalSlides={optimizedImages.length}
          >
            <Slider>
              {optimizedImages.map((optimizedImage, index) => {
                return (
                  <Slide index={index} key={index}>
                    <Image
                      fluid={optimizedImage.childImageSharp.fluid}
                      alt={`Image ${index + 1} of ${name}`}
                      loading={index === 0 ? 'eager' : 'lazy'}
                      className='select-none'
                    />
                  </Slide>
                )
              })}
            </Slider>
            <nav>
              {optimizedImages.map((optimizedImage, index) => {
                return (
                  <Dot slide={index} key={index} className='focus:outline-none'>
                    <Image
                      fixed={optimizedImage.childImageSharp.fixed}
                      alt={`Thumbnail ${index + 1} of ${name}`}
                      className='select-none'
                    />
                  </Dot>
                )
              })}
            </nav>
          </CarouselProvider>
        </div>
        <div className='lg:w-2/5'>
          <h1>{name}</h1>
          <h2>{price}</h2>
          <h3>{getQuantity(id, quantity)}</h3>
          <h3>{availability}</h3>
          <button type='button' onClick={() => addToCart(item)}>
            Add to cart
          </button>
        </div>
      </div>
      <article>{description}</article>
    </Layout>
  )
}

export default Item

export const pageQuery = graphql`
  query($id: ID!) {
    amadeus {
      item(id: $id) {
        name
        price
        images
        optimizedImages {
          childImageSharp {
            fluid(maxWidth: 750, maxHeight: 750) {
              ...GatsbyImageSharpFluid_withWebp_tracedSVG
            }
            fixed(width: 100, height: 100) {
              ...GatsbyImageSharpFixed_withWebp_tracedSVG
            }
          }
        }
        description
        quantity
        availability
        id
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
