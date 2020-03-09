import React, { useContext } from 'react';
import { Link } from 'gatsby';
import { SharedContext } from '../state/shared';
import { item } from '../locales';

export const Breadcrumbs = ({ name, type, slug }) => {
    const { language, getLanguagePrefix } = useContext(SharedContext);

    return (
        <ol
            className='breadcrumbs'
            vocab='https://schema.org/'
            typeof='BreadcrumbList'
        >
            <li property='itemListElement' typeof='ListItem'>
                <Link
                    to={`${getLanguagePrefix(language)}/`}
                    property='item'
                    typeof='WebPage'
                >
                    <span property='name'>
                        {item[language].breadcrumbs.home}
                    </span>
                </Link>
                <meta property='position' content='1' />
            </li>
            <span>{' › '}</span>
            <li property='itemListElement' typeof='ListItem'>
                <Link
                    to={`${getLanguagePrefix(language)}/${type[
                        language
                    ].toLowerCase()}/`}
                    property='item'
                    typeof='WebPage'
                >
                    <span property='name'>{type[language]}</span>
                </Link>
                <meta property='position' content='2' />
            </li>
            <span>{' › '}</span>
            <li property='itemListElement' typeof='ListItem'>
                <span property='name'>{name[language]}</span>
                <meta property='position' content='3' />
            </li>
        </ol>
    );
};
