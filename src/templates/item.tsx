import React from 'react'
import { graphql, Link } from 'gatsby'
import Image from 'gatsby-image'
import '../styles/main.scss'

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
}

const Item: React.FC<Props> = ({ data }) => {
  const { name, price, desc, slug, qt, avb, id__normalized: id } = data.items
  const { nodes: images } = data.allS3Image
  return (
    <div>
      <p>Name: {name}</p>
      {images.map((image: any) => {
        // TODO inplement interface
        const { fluid } = image.localFile.childImageSharp
        return (
          <div className="div">
            <Link to={`/${slug}/`}>
              <Image fluid={fluid} />
            </Link>
          </div>
        )
      })}
      <p>Slug: {slug}</p>
      <p>Price: {price}</p>
      <p>Id: {id}</p>
      <p>Description: {desc}</p>
      <p>Quantity: {qt}</p>
      <p>Availability: {avb}</p>
    </div>
  )
}

export default Item

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
