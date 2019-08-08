require('dotenv').config()

const itemQuery = `
  {
    allItems {
      nodes {
        name
        price
        id__normalized
        desc
      }
    }
  }
`

const queries = [
  {
    query: itemQuery,
    transformer: ({ data }) => data.allItems.nodes.map(node => node), // optional
    settings: {}
  }
]

module.exports = {
  plugins: [
    'gatsby-plugin-eslint',
    'gatsby-plugin-sass',
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-typescript',
    'gatsby-transformer-sharp',
    'gatsby-plugin-sharp',
    {
      resolve: 'gatsby-source-custom-api',
      options: {
        url: 'https://api.amadeus2.hr/list/',
        rootKey: 'items',
        schemas: {
          items: `
            name: String
            id: String
            desc: String
            slug: String
            price: Int
            qt: Int
            avb: Int
          `
        }
      }
    },
    {
      resolve: 'gatsby-source-s3',
      options: {
        aws: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_ACCESS_SECRET_KEY
        },
        buckets: ['amadeus-images']
      }
    },
    {
      resolve: 'gatsby-plugin-algolia',
      options: {
        appId: process.env.ALGOLIA_APP_ID,
        apiKey: process.env.ALGOLIA_API_KEY,
        indexName: process.env.ALGOLIA_INDEX_NAME,
        queries,
        chunkSize: 10000 // default: 1000
      }
    }
  ]
}
