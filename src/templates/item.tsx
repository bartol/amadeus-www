import Carousel, { Dots } from '@brainhubeu/react-carousel'
import { graphql } from 'gatsby'
import Image from 'gatsby-image'
import React, { useState } from 'react'
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
  } = item

  const [visibleImage, setVisibleImage] = useState(0)

  const images = optimizedImages.map((optimizedImage, index) => {
    return (
      <Image
        fluid={optimizedImage.childImageSharp.fluid}
        alt={`Image ${index + 1} of ${name}`}
        key={index}
        className='lg:w-3/5'
      />
    )
  })

  const thumbnails = optimizedImages.map((optimizedImage, index) => {
    return (
      <Image
        fixed={optimizedImage.childImageSharp.fixed}
        alt={`Thumbnail ${index + 1} of ${name}`}
        key={index}
        className='lg:w-20'
      />
    )
  })

  return (
    <Layout>
      <h1>{name}</h1>
      <h2>{price}</h2>
      <h3>{quantity}</h3>
      <h3>{availability}</h3>
      <article>{description}</article>
      <Carousel value={visibleImage}>{images}</Carousel>
      <Dots
        thumbnails={thumbnails}
        value={visibleImage}
        onChange={visibleImage => setVisibleImage(visibleImage)}
      />
      <button onClick={() => setVisibleImage(visibleImage + 1)}>BTN</button>
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
