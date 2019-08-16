import React from 'react'
import Image from 'gatsby-image'

interface Props {
  image: any
}

const ItemImage: React.FC<Props> = ({ image }) => {
  const { localFile } = image
  const { childImageSharp } = localFile
  const { fluid } = childImageSharp
  return <Image fluid={fluid} className="ItemImage" />
}

export default ItemImage
