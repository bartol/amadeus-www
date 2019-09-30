const { createRemoteFileNode } = require(`gatsby-source-filesystem`)

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
        resolve: (source, args, context, info) => {
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
