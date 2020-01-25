module.exports = {
    plugins: [
        'gatsby-plugin-preact',
        'gatsby-plugin-sass',
        {
            resolve: 'gatsby-source-graphql',
            options: {
                typeName: 'Amadeus',
                fieldName: 'amadeus',
                url: 'https://api.amadeus2.hr',
            },
        },
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
