import React from 'react';
import PropTypes from 'prop-types';

const Layout = ({ children }) => {
    return (
        <>
            <h1> from layout </h1>
            <main>{children}</main>
        </>
    );
};

Layout.propTypes = {
    children: PropTypes.element.isRequired,
};

export default Layout;
