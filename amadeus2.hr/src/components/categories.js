// FIXME i18n
import React, { useContext } from 'react';
import { useStaticQuery, graphql, Link } from 'gatsby';
import { SharedContext } from '../state/shared';
import Image from 'gatsby-image';

export const Categories = () => {
    const { language, getLanguagePrefix } = useContext(SharedContext);

    const data = useStaticQuery(graphql`
        query typesQuery {
            amadeus {
                types {
                    name
                    src
                    optimized {
                        childImageSharp {
                            # category
                            fluid(maxWidth: 300, maxHeight: 160) {
                                ...GatsbyImageSharpFluid_withWebp
                            }
                        }
                    }
                }
            }
        }
    `);

    const { types } = data.amadeus;
    const languages = ['hr', 'en'];
    const language_index = languages.indexOf(language);

    return (
        <>
            {/* FIXME i18n */}
            <h2 className='featured_heading'>Kategorije</h2>
            <ul className='categories'>
                {types.map(type => {
                    const name = type.name.split('|||')[language_index];
                    return (
                        <li key={type.name} className='category'>
                            <Link
                                to={`${getLanguagePrefix(
                                    language
                                )}/${name.toLowerCase()}/`}
                            >
                                <Image
                                    fluid={type.optimized.childImageSharp.fluid}
                                    className='category_image'
                                />
                                <span>{name}</span>
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </>
    );
};
