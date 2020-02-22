import React, { useContext } from 'react';
import { Link } from 'gatsby';
import { SharedContext } from '../state/shared';
import { item } from '../locales';

export const Breadcrumbs = ({ name, type, slug }) => {
    const { language, getLanguagePrefix } = useContext(SharedContext);

    return (
        <nav className='breadcrumbs'>
            <Link to={`${getLanguagePrefix(language)}/`}>
                {item[language].breadcrumbs.home}
            </Link>
            {' › '}
            <Link
                to={`${getLanguagePrefix(language)}/${type[
                    language
                ].toLowerCase()}/`}
            >
                {type[language]}
            </Link>
            {' › '}
            <Link
                to={`${getLanguagePrefix(language)}/${type[
                    language
                ].toLowerCase()}/${slug}`}
            >
                {name[language]}
            </Link>
        </nav>
    );
};
