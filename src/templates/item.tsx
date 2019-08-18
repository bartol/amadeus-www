import React, { useState } from 'react'
import { graphql } from 'gatsby'
import Image from 'gatsby-image'
import '../styles/main.scss'
import { connect } from 'react-redux'
// @ts-ignore
import { addToCart } from '../state/actions'
import ItemImage from '../components/ItemImage'
import Layout from '../components/Layout'

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
}

const Item: React.FC<Props> = ({ data, addToCart }) => {
  const { name, price, desc, slug, qt, avb, id__normalized: id } = data.items
  const { nodes: images } = data.allS3Image
  const [image, setImage] = useState(0)
  return (
    <Layout>
      <div className="itemWrapper">
        <div className="carousel">
          <ItemImage image={images[image]} />
          <div className="slider">
            {images.map((image: any, index: any) => {
              const { localFile, Key } = image
              const { childImageSharp } = localFile
              const { fluid } = childImageSharp
              return (
                <div
                  className="slider-image"
                  key={Key}
                  onClick={() => {
                    setImage(index)
                    console.log(index)
                  }}
                >
                  <Image fluid={fluid} />
                </div>
              )
              // return <pre>{JSON.stringify(image)}</pre>
            })}
          </div>
        </div>
        <div className="details">
          <p>Name: {name}</p>
          <p>Slug: {slug}</p>
          <p>Price: {price / 100} kn</p>
          <p>Id: {id}</p>
          <p>Description: {desc}</p>
          <p>Quantity: {qt}</p>
          <p>Availability: {avb}</p>
          <button type="button" onClick={() => addToCart(data.items)}>
            Add to cart
          </button>
        </div>
      </div>
    </Layout>
  )
}

export default connect(
  null,
  { addToCart }
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
        }
      }
    }
  }
`
