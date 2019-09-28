const data = require('./pages.json')

exports.createPages = ({ boundActionCreators }) => {
  const { createPage } = boundActionCreators

  const template = require.resolve('./src/templates/item.tsx')

  // Create pages for each JSON entry.
  data.forEach(({ page }) => {
    const path = page

    createPage({
      path,
      component: template,
      context: {
        path,
      },
    })
  })
}
