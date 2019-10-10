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

exports.onCreatePage = ({ page, actions }) => {
  const { createPage, deletePage } = actions
  deletePage(page)

  createPage({
    ...page,
    context: {
      ...page.context,
      language: 'hr',
    },
  })

  createPage({
    ...page,
    path: `/en${page.path}`,
    context: {
      ...page.context,
      language: 'en',
    },
  })
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
    Amadeus_Item: {
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

  createResolvers({
    Amadeus_Banners: {
      optimizedDesktop: {
        type: '[File!]!',
        resolve: (source, _args, _context, _info) => {
          return source.desktop.map(url => {
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
      optimizedMobile: {
        type: '[File!]!',
        resolve: (source, _args, _context, _info) => {
          return source.mobile.map(url => {
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
        language: 'hr',
      },
    })

    actions.createPage({
      path: `/en/${slug}/`,
      component: require.resolve('./src/templates/item.tsx'),
      context: {
        id,
        language: 'en',
      },
    })
  })
}
