/* eslint-disable no-use-before-define */
/* eslint-disable camelcase */
/* eslint-disable no-console */
const { createRemoteFileNode } = require('gatsby-source-filesystem')
const axios = require('axios')

exports.onCreateNode = async ({ node, actions, store, cache }) => {
  if (node.internal.type !== 'items') {
    return
  }

  axios
    .get(`https://res.cloudinary.com/bartol/image/list/${node.slug}.json`)
    .then(res => {
      res.data.resources.map(async (img, index) => {
        const { public_id, format } = img

        const url = `https://res.cloudinary.com/bartol/image/upload/v1568838287/${public_id}.${format}`

        const { createNode } = actions
        // download image and create a File node
        // with gatsby-transformer-sharp and gatsby-plugin-sharp
        // that node will become an ImageSharp
        const fileNode = await createRemoteFileNode({
          url,
          store,
          cache,
          createNode,
          createNodeId: id => `item-image-${node.name}-${id}`
        })

        if (fileNode) {
          // link File node to DogImage node
          // at field image
          // eslint-disable-next-line no-param-reassign
          node[`image${index}___NODE`] = fileNode.id
          // node.image___NODE = fileNode.id
        }
      })
    })
}

exports.createPages = async ({ actions, graphql }) => {
  const { data } = await graphql(`
    {
      allItems {
        nodes {
          id__normalized
          name
          slug
        }
      }
    }
  `)

  const items = data.allItems.nodes

  items.forEach(item => {
    const { slug, id__normalized: id } = item
    const regex = `/^${slug}/`
    actions.createPage({
      path: slug,
      component: require.resolve(`./src/templates/item.tsx`),
      context: { id, regex }
    })
  })
}
