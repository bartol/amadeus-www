import React, { useContext } from 'react'
import { graphql } from 'gatsby'
import Image from 'gatsby-image'
import { CarouselProvider, Dot, Slide, Slider } from 'pure-react-carousel'
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
      availability {
        hr
        en
      }
    }
  }
`

const Item: React.FC<Props> = ({ data, pageContext }) => {
  const { language } = pageContext
  const {
    name,
    type,
    slug,
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
    <Layout
      language={language}
      newUrl={
        language === 'hr'
          ? `/en/${type.en.toLowerCase()}/${slug}/`
          : `/${type.hr.toLowerCase()}/${slug}/`
      }
    >
      <nav>
        <Link to={language === 'hr' ? `/` : `/en/`}>Home</Link>
        {' › '}
        <Link
          to={
            language === 'hr'
              ? `/${type.hr.toLowerCase()}/`
              : `/${type.en.toLowerCase()}/`
          }
        >
          {type[language]}
        </Link>
        {' › '}
        <Link
          to={
            language === 'hr'
              ? `/${type.hr.toLowerCase()}/${slug}/`
              : `/en/${type.en.toLowerCase()}/${slug}/`
          }
        >
          {name[language]}
        </Link>
      </nav>
      <div className='flex'>
        <div className='lg:w-3/5 pr-4'>
          <CarouselProvider
            naturalSlideWidth={4}
            naturalSlideHeight={3}
            totalSlides={images.length}
          >
            <Slider>
              {images
                .sort((a, b) => a.index - b.index)
                .map((image, index) => {
                  return (
                    <Slide index={index} key={index}>
                      <Image
                        fluid={image.optimized.childImageSharp.fluid}
                        alt={`Image ${index + 1} of ${name}`}
                        loading={index === 0 ? 'eager' : 'lazy'}
                        className='select-none'
                        fadeIn
                      />
                    </Slide>
                  )
                })}
            </Slider>
            <nav>
              {images.map((image, index) => {
                return (
                  <Dot
                    slide={index}
                    key={index}
                    className='focus:outline-none m-1 dot-image'
                  >
                    <Image
                      fixed={image.optimized.childImageSharp.fixed}
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
          <h1>{name[language]}</h1>
          <h2>{currencyConversion(runTimeItem.price || price)}</h2>
          <h3>{getQuantity(id, runTimeItem.quantity || quantity)}</h3>
          <h3>
            {runTimeItem.availability
              ? runTimeItem.availability[language]
              : availability[language]}
          </h3>
          <button type='button' onClick={() => addToCart(addToCartItem)}>
            Add to cart
          </button>
        </div>
      </div>
      <article dangerouslySetInnerHTML={{ __html: description[language] }} />
    </Layout>
  )
}

export default Item

export const pageQuery = graphql`
  query($id: ID!) {
    amadeus {
      item(id: $id) {
        name {
          hr
          en
        }
        price
        slug
        type {
          hr
          en
        }
        images {
          src
          index
          optimized {
            childImageSharp {
              fluid(maxWidth: 800, maxHeight: 600) {
                ...GatsbyImageSharpFluid_withWebp_tracedSVG
              }
              fixed(width: 120, height: 90) {
                ...GatsbyImageSharpFixed_withWebp_tracedSVG
              }
            }
          }
        }
        hidden
        description {
          hr
          en
        }
        quantity
        availability {
          hr
          en
        }
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
  name: {
    hr: string
    en: string
  }
  price: number
  description: {
    hr: string
    en: string
  }
  slug: string
  type: {
    hr: string
    en: string
  }
  id: string
  quantity: number
  availability: string
  images: Image[]
}

interface Image {
  index: number
  src: string
  optimized: OptimizedImage
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
