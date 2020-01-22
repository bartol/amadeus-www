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
      hidden: {
        type: 'Boolean!',
        resolve: () => false,
      },
    },
  })

  const need_optimization = ['Amadeus_Image', 'Amadeus_Type', 'Amadeus_Banner']
  need_optimization.forEach(item => {
    createResolvers({
      [item]: {
        optimized: {
          type: 'File!',
          resolve: (source, _args, _context, _info) => {
            return createRemoteFileNode({
              url: source.src,
              store,
              cache,
              createNode,
              createNodeId,
              reporter,
            })
          },
        },
      },
    })
  })
}

exports.createPages = async ({ actions, graphql, reporter }) => {
  const query = await graphql(`
    {
      amadeus {
        items {
          slug
          type {
            hr
            en
          }
          brand
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
    const { slug, type, id } = item

    actions.createPage({
      path: `/${type.hr.toLowerCase()}/${slug}/`,
      component: require.resolve('./src/templates/item.tsx'),
      context: {
        id,
        language: 'hr',
      },
    })

    actions.createPage({
      path: `/en/${type.en.toLowerCase()}/${slug}/`,
      component: require.resolve('./src/templates/item.tsx'),
      context: {
        id,
        language: 'en',
      },
    })
  })

  const types_hr = [...new Set(items.map(item => item.type.hr))]
  const types_en = [...new Set(items.map(item => item.type.en))]

  types_hr.map(type => {
    actions.createPage({
      path: `/${type.toLowerCase()}/`,
      component: require.resolve('./src/templates/type.tsx'),
      context: {
        type,
        language: 'hr',
      },
    })
  })

  types_en.map(type => {
    actions.createPage({
      path: `/en/${type.toLowerCase()}/`,
      component: require.resolve('./src/templates/type.tsx'),
      context: {
        type,
        language: 'en',
      },
    })
  })
}
