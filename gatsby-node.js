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
