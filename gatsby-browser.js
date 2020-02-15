// Shared state
export { wrapRootElement } from './src/state/wrap-root-element';

// Styles
import './src/styles/styles.scss';

// glider-js styles
import 'glider-js/glider.min.css';

const shouldUpdateScroll = ({
    routerProps: { location },
    getSavedScrollPosition,
}) => {
    const currentPosition = getSavedScrollPosition(location);

    window.scrollTo(...(currentPosition || [0, 0]));

    return false;
};
export { shouldUpdateScroll };
