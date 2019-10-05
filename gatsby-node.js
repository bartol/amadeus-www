const { createRemoteFileNode } = require('gatsby-source-filesystem')

exports.onCreateWebpackConfig = ({ getConfig, stage }) => {
  const config = getConfig()
  if (stage.startsWith('develop') && config.resolve) {
    config.resolve.alias = {
      ...config.resolve.alias,
      'react-dom': '@hot-loader/react-dom',
    }
  }
}

exports.createResolvers = ({
  actions,
  cache,
  createNodeId,
  createResolvers,
  store,
  reporter,
}) => {
  const { createNode } = actions

  createResolvers({
    amadeus_Item: {
      optimizedImages: {
        type: '[File!]!',
        resolve: (source, _args, _context, _info) => {
          return source.images.map(url => {
            return createRemoteFileNode({
              url,
              store,
              cache,
              createNode,
              createNodeId,
              reporter,
            })
          })
        },
      },
    },
  })
}

exports.createPages = async ({ actions, graphql, reporter }) => {
  const query = await graphql(`
    {
      amadeus {
        items {
          slug
          id
        }
      }
    }
  `)

  if (query.errors) {
    reporter.panic('failed to create pages', query.errors)
  }

  const { items } = query.data.amadeus

  items.forEach(item => {
    const { slug, id } = item
    actions.createPage({
      path: `/${slug}/`,
      component: require.resolve('./src/templates/item.tsx'),
      context: {
        id,
      },
    })
  })
}
