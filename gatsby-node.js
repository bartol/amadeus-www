const { createRemoteFileNode } = require('gatsby-source-filesystem');

// Download all remote images to optimize them
exports.createResolvers = ({
    actions,
    cache,
    createNodeId,
    createResolvers,
    store,
    reporter,
}) => {
    const { createNode } = actions;

    const need_optimization = [
        'Amadeus_Image',
        'Amadeus_Type',
        'Amadeus_Banner',
    ];
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
                        });
                    },
                },
            },
        });
    });
};

// For each page create multiple versions based on language
exports.onCreatePage = ({ page, actions }) => {
    const { createPage, deletePage } = actions;
    deletePage(page);

    createPage({
        ...page,
        context: {
            ...page.context,
            language: 'hr',
        },
    });

    // createPage({
    //     ...page,
    //     path: `/en${page.path}`,
    //     context: {
    //         ...page.context,
    //         language: 'en',
    //     },
    // });
};

// Create item and type pages
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
                    id
                }
            }
        }
    `);

    if (query.errors) {
        reporter.panic('failed to create pages', query.errors);
    }

    const { items } = query.data.amadeus;

    items.forEach(item => {
        const { slug, type, id } = item;

        actions.createPage({
            path: `/${type.hr.toLowerCase()}/${slug}/`,
            component: require.resolve('./src/templates/item.js'),
            context: {
                id,
                language: 'hr',
            },
        });

        // actions.createPage({
        //     path: `/en/${type.en.toLowerCase()}/${slug}/`,
        //     component: require.resolve('./src/templates/item.js'),
        //     context: {
        //         id,
        //         language: 'en',
        //     },
        // });
    });

    const types_hr = [...new Set(items.map(item => item.type.hr))];
    // const types_en = [...new Set(items.map(item => item.type.en))];

    types_hr.map(type => {
        actions.createPage({
            path: `/${type.toLowerCase()}/`,
            component: require.resolve('./src/templates/type.js'),
            context: {
                type,
                language: 'hr',
            },
        });
    });

    // types_en.map(type => {
    //     actions.createPage({
    //         path: `/en/${type.toLowerCase()}/`,
    //         component: require.resolve('./src/templates/type.js'),
    //         context: {
    //             type,
    //             language: 'en',
    //         },
    //     });
    // });
};
