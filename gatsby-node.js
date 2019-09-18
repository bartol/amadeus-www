/* eslint-disable camelcase */
/* eslint-disable no-console */
const axios = require('axios')

exports.onCreateNode = async ({ node, actions }) => {
  const { createNodeField } = actions
  if (node.internal.type === 'items') {
    axios
      .get(`https://res.cloudinary.com/bartol/image/list/${node.slug}.json`)
      .then(res => {
        const data = res.data.resources.map(img => {
          const { public_id, format } = img

          return `https://res.cloudinary.com/bartol/image/upload/v1568838287/${public_id}.${format}`
        })

        createNodeField({
          node,
          name: 'images',
          value: data
        })
      })
  }
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
