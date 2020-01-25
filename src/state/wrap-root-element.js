import React from 'react';
import PropTypes from 'prop-types';
import { SharedProvider } from './shared';

export const wrapRootElement = ({ element }) => {
    return <SharedProvider>{element}</SharedProvider>;
};

wrapRootElement.propTypes = {
    element: PropTypes.element.isRequired,
};
