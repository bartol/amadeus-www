import React, { useEffect } from 'react'
import { graphql } from 'gatsby'
import Image from 'gatsby-image'
import '../styles/main.scss'
import { connect } from 'react-redux'
import { ChevronRight, ChevronLeft } from 'react-feather'
import {
  CarouselProvider,
  Slider,
  Slide,
  ButtonBack,
  ButtonNext,
  Dot
} from 'pure-react-carousel'
// import mediumZoom from 'medium-zoom'
import {
  addToCart as reduxAddToCart,
  toggleCart as reduxToggleCart
  // @ts-ignore
} from '../state/actions'
import Cart from '../components/cart'
// import Layout from '../components/Layout'
import 'pure-react-carousel/dist/react-carousel.es.css'

interface Props {
  data: {
    items: {
      name: string
      desc: string
      slug: string
      id__normalized: string
      price: number
      qt: number
      avb: number
      image0: number
      image1: number
      image2: number
    }
    allS3Image: {
      nodes: object[]
    }
  }
  addToCart: any
  cart: any
  menu: any
  toggleCart: any
}

const Item: React.FC<Props> = ({ data, addToCart, menu, cart, toggleCart }) => {
  const {
    name,
    price,
    desc,
    qt,
    id__normalized: id,
    image0,
    image1,
    image2
  } = data.items
  const cartItem = cart.filter((e: any) => e.id__normalized === id)
  const cqt = cartItem.length ? cartItem[0].cqt : 0

  const images = []

  if (image0) {
    images.push(image0)
  }
  if (image1) {
    images.push(image1)
  }
  if (image2) {
    images.push(image2)
  }

  useEffect(() => {
    if (menu.isCartOpened) {
      toggleCart()
    }
  }, [])

  return (
    <div>
      <div
        className={`itemWrapper ${menu.isCartOpened ? 'open' : 'close'}`}
        onClick={() => (menu.isCartOpened ? toggleCart() : null)}
        role="presentation"
      >
        <CarouselProvider
          naturalSlideWidth={500}
          naturalSlideHeight={500}
          totalSlides={images.length}
        >
          <div className="imageWrapper">
            {images.length > 1 ? (
              <>
                <Slider>
                  {images.map((image: any, index: any) => {
                    const { childImageSharp } = image
                    const { fluid, id: Key } = childImageSharp
                    return (
                      <Slide index={index} key={Key}>
                        <Image
                          fluid={fluid}
                          className="gatsby-resp-item-image"
                        />
                      </Slide>
                    )
                  })}
                </Slider>
                <ButtonBack className="buttonBack">
                  <ChevronLeft size={48} />
                </ButtonBack>
                <ButtonNext className="buttonNext">
                  <ChevronRight size={48} />
                </ButtonNext>
              </>
            ) : (
              <Image
                // @ts-ignore
                fluid={images[0].childImageSharp.fluid}
                className="gatsby-resp-item-image"
              />
            )}
          </div>

          {images.length > 1 && (
            <div className="dotWrapper">
              {images.map((image: any, index: any) => {
                const { childImageSharp } = image
                const { fixed, id: Key } = childImageSharp
                return (
                  <Dot slide={index} key={Key} className="dot">
                    <Image fixed={fixed} />
                  </Dot>
                )
              })}
            </div>
          )}
        </CarouselProvider>
        <div className="details">
          <h1>{name}</h1>
          <i>{id}</i>
          <h2>{price / 100} kn</h2>
          <p>{desc}</p>
          <p>{qt - cqt} kom.</p>
          <button
            type="button"
            onClick={() => addToCart(data.items)}
            disabled={!(qt - cqt)}
          >
            Add to cart
          </button>
        </div>
      </div>
      <button
        type="button"
        // className={`toggleCart ${cartOpened ? 'open' : 'close'}`}
        className={`toggleCart ${menu.isCartOpened ? 'open' : 'close'}`}
        // onClick={() => isCartOpened(!cartOpened)}
        onClick={() => toggleCart()}
      >
        Cart
      </button>
      <Cart opened={menu.isCartOpened} />
    </div>
  )
}

export default connect(
  (state: any) => ({
    menu: state.menu,
    cart: state.cart
  }),
  { addToCart: reduxAddToCart, toggleCart: reduxToggleCart }
)(Item)

export const query = graphql`
  query($id: String!) {
    items(id__normalized: { eq: $id }) {
      name
      price
      slug
      id__normalized
      desc
      qt
      avb
      image0 {
        ...fluidImage
      }
      image1 {
        ...fluidImage
      }
      image2 {
        ...fluidImage
      }
    }
  }
`

export const fluidImage = graphql`
  fragment fluidImage on File {
    childImageSharp {
      fluid(maxWidth: 500) {
        ...GatsbyImageSharpFluid_withWebp
      }
    }
    childImageSharp {
      fixed(width: 75) {
        ...GatsbyImageSharpFixed_withWebp
      }
    }
  }
`
