import React from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import Image from 'gatsby-image'

const cartImage = ({ ImageKey }: any) => {
  const data = useStaticQuery(graphql`
    {
      allS3Image {
        nodes {
          Key
          localFile {
            childImageSharp {
              fixed(width: 150, height: 150) {
                ...GatsbyImageSharpFixed_withWebp
              }
            }
          }
        }
      }
    }
  `)

  const { nodes } = data.allS3Image
  const regex = new RegExp(ImageKey)
  const filtered = nodes.filter(({ Key }: any) => {
    return Key.match(regex)
  })
  const { fixed } = filtered[0].localFile.childImageSharp

  return (
    <div className="cartImage">
      <Image fixed={fixed} />
    </div>
  )
}

export default cartImage
