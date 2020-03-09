module.exports = {
    siteMetadata: {
        siteUrl: 'https://amadeus2.hr',
    },
    plugins: [
        'gatsby-plugin-preact',
        'gatsby-plugin-sass',
        // Transform images
        'gatsby-plugin-sharp',
        'gatsby-transformer-sharp',
        // Connect to API
        {
            resolve: 'gatsby-source-graphql',
            options: {
                typeName: 'Amadeus',
                fieldName: 'amadeus',
                url: 'https://api.amadeus2.hr',
            },
        },
        // SEO
        'gatsby-plugin-react-helmet',
        'gatsby-plugin-sitemap',
        // Analyze bundle size
        {
            resolve: 'gatsby-plugin-webpack-bundle-analyzer',
            options: {
                production: true,
                disable: !process.env.ANALYZE_BUNDLE_SIZE,
                generateStatsFile: true,
                analyzerMode: 'static',
            },
        },
    ],
};
