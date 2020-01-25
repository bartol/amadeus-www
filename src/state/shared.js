import React, { useState, createContext } from 'react';
import PropTypes from 'prop-types';
import isBrowser from '../helpers/isBrowser';

export const SharedContext = createContext();

export const SharedProvider = ({ children }) => {
    const [currency, setCurrency] = useState(
        // get currency from localstorage, if not found or SSR set to HRK
        isBrowser() ? window.localStorage.getItem('currency') || 'HRK' : 'HRK'
    );

    return (
        <SharedContext.Provider
            value={{
                currency,
                setCurrency,
            }}
        >
            {children}
        </SharedContext.Provider>
    );
};

SharedProvider.propTypes = {
    children: PropTypes.element.isRequired,
};
