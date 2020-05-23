import React from 'react';
import { SharedProvider } from './shared';

export const wrapRootElement = ({ element }) => {
    return <SharedProvider>{element}</SharedProvider>;
};
