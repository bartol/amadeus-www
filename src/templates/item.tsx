import React, { useContext } from 'react'
import { graphql } from 'gatsby'
import Image from 'gatsby-image'
import {
  CarouselProvider,
  Dot,
  Slide,
  Slider,
  ButtonBack,
  ButtonNext,
} from 'pure-react-carousel'
import 'pure-react-carousel/dist/react-carousel.es.css'
import { CartContext, I18nContext } from '../state/global'
import Layout from '../components/layout'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

const ITEM_QUERY = gql`
  query ItemQuery($id: ID!) {
    item(id: $id) {
      price
      quantity
      availability
    }
  }
`

const Item: React.FC<Props> = ({ data, pageContext }) => {
  const { language } = pageContext
  const {
    name,
    price,
    description,
    quantity,
    availability,
    optimizedImages: images,
    id,
  } = data.amadeus.item

  const { addToCart, getQuantity } = useContext(CartContext)
  const { currencyConversion } = useContext(I18nContext)

  const { data: runTimeData } = useQuery(ITEM_QUERY, {
    fetchPolicy: 'cache-and-network',
    variables: { id },
  })
  const runTimeItem = runTimeData ? runTimeData.item : {}

  const addToCartItem = {
    name,
    price: runTimeItem.price || price,
    quantity: runTimeItem.quantity || quantity,
    availability: runTimeItem.availability || availability,
    image: images[0],
    id,
  }

  return (
    <Layout language={language}>
      <div className='flex'>
        <div className='lg:w-3/5 pr-4'>
          <CarouselProvider
            naturalSlideWidth={4}
            naturalSlideHeight={3}
            totalSlides={images.length}
          >
            <Slider>
              {images.map((image, index) => {
                return (
                  <Slide index={index} key={index}>
                    <Image
                      fluid={image.childImageSharp.fluid}
                      alt={`Image ${index + 1} of ${name}`}
                      loading={index === 0 ? 'eager' : 'lazy'}
                      className='select-none'
                      fadeIn
                    />
                  </Slide>
                )
              })}
            </Slider>
            <ButtonBack>Back</ButtonBack>
            <ButtonNext>Next</ButtonNext>
            <nav>
              {images.map((image, index) => {
                return (
                  <Dot
                    slide={index}
                    key={index}
                    className='focus:outline-none mx-1 dot-image'
                  >
                    <Image
                      fixed={image.childImageSharp.fixed}
                      alt={`Thumbnail ${index + 1} of ${name}`}
                      className='select-none'
                      fadeIn
                    />
                  </Dot>
                )
              })}
            </nav>
          </CarouselProvider>
        </div>
        <div className='lg:w-2/5'>
          <h1>{name}</h1>
          <h2>{currencyConversion(runTimeItem.price || price)}</h2>
          <h3>{getQuantity(id, runTimeItem.quantity || quantity)}</h3>
          <h3>{runTimeItem.availability || availability}</h3>
          <button type='button' onClick={() => addToCart(addToCartItem)}>
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
            fluid(maxWidth: 800, maxHeight: 600) {
              ...GatsbyImageSharpFluid_withWebp_tracedSVG
            }
            fixed(width: 120, height: 90) {
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
