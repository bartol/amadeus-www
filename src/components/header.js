import React, { useContext } from 'react';
import { Link } from 'gatsby';
import { SharedContext } from '../state/shared';

export const Header = ({ changeLanguageCustomUrl }) => {
    const {
        language,
        getLanguagePrefix,
        changeLanguage,
        currency,
        changeCurrency,
    } = useContext(SharedContext);

    return (
        <header>
            <Link to={`${getLanguagePrefix(language)}/`}>Amadeus</Link>
            <select
                onChange={e =>
                    changeLanguage(e.target.value, changeLanguageCustomUrl)
                }
                value={language}
            >
                <option value='hr'>Hrvatski</option>
                <option value='en'>English</option>
            </select>
            <select
                value={currency}
                onChange={e => changeCurrency(e.target.value)}
            >
                <option value='HRK'>HRK</option>
                <option value='EUR'>EUR</option>
                <option value='BAM'>BAM</option>
                <option value='RSD'>RSD</option>
                <option value='USD'>USD</option>
                <option value='GBP'>GBP</option>
            </select>
        </header>
    );
};
