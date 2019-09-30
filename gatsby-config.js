const path = require('path')

module.exports = {
  plugins: [
    'gatsby-plugin-typescript',
    {
      resolve: 'gatsby-plugin-webpack-bundle-analyzer',
      options: {
        production: true,
        disable: !process.env.ANALYZE_BUNDLE_SIZE,
        generateStatsFile: true,
        analyzerMode: 'static',
      },
    },
    // fix to get gatsby graphql 'File' type
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: path.resolve('./src'),
      },
    },
    {
      resolve: 'gatsby-source-graphql',
      options: {
        typeName: 'amadeus',
        fieldName: 'amadeus',
        url: 'https://api.amadeus2.hr',
      },
    },
    'gatsby-transformer-sharp',
    'gatsby-plugin-sharp',
    'gatsby-plugin-postcss',
  ],
}
