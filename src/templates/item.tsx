import React from 'react'
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
import {
  addToCart as reduxAddToCart,
  toggleCart as reduxToggleCart
  // @ts-ignore
} from '../state/actions'
import Cart from '../components/cart'
import Layout from '../components/Layout'
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

const Item: React.FC<Props> = ({ data, addToCart, menu, toggleCart }) => {
  const { name, price, desc, qt, id__normalized: id } = data.items
  const { nodes: images } = data.allS3Image

  return (
    <Layout>
      <div className={`itemWrapper ${menu.isCartOpened ? 'open' : 'close'}`}>
        <CarouselProvider
          naturalSlideWidth={500}
          naturalSlideHeight={500}
          totalSlides={images.length}
        >
          <div className="imageWrapper">
            <Slider>
              {images.map((image: any, index: any) => {
                const { localFile, Key } = image
                const { childImageSharp } = localFile
                const { fluid } = childImageSharp
                return (
                  <Slide index={index} key={Key}>
                    <Image fluid={fluid} />
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
          </div>
          <div className="dotWrapper">
            {images.map((image: any, index: any) => {
              const { localFile, Key } = image
              const { childImageSharp } = localFile
              const { fixed } = childImageSharp
              return (
                <Dot slide={index} key={Key} className="dot">
                  <Image fixed={fixed} />
                </Dot>
              )
            })}
          </div>
        </CarouselProvider>
        <div className="details">
          <h1>{name}</h1>
          <i>{id}</i>
          <h2>{price / 100} kn</h2>
          <p>{desc}</p>
          <p>{qt} kom.</p>
          <button type="button" onClick={() => addToCart(data.items)}>
            Add to cart
          </button>
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
        {/* <Cart opened={cartOpened} /> */}
        <Cart opened={menu.isCartOpened} />
      </div>
    </Layout>
  )
}

export default connect(
  (state: any) => ({
    menu: state.menu
  }),
  { addToCart: reduxAddToCart, toggleCart: reduxToggleCart }
)(Item)

export const query = graphql`
  query($id: String!, $regex: String!) {
    items(id__normalized: { eq: $id }) {
      name
      price
      slug
      id__normalized
      desc
      qt
      avb
    }
    allS3Image(
      filter: { Key: { regex: $regex } }
      sort: { fields: Key, order: ASC }
    ) {
      nodes {
        Key
        localFile {
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
      }
    }
  }
`
