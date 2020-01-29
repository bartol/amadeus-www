import React, { useState, useEffect, createContext } from 'react';
import { navigate } from 'gatsby';
import Fuse from 'fuse.js';
import { isBrowser } from '../helpers/isBrowser';

export const SharedContext = createContext();

export const SharedProvider = ({ children }) => {
    // Language state
    const [language, setLanguage] = useState('hr');

    const changeLanguage = (newLanguage, customUrl) => {
        if (customUrl && customUrl[newLanguage]) {
            navigate(customUrl[newLanguage], { replace: true });
        } else {
            if (isBrowser()) {
                const { pathname } = window.location;
                const pathnameWithoutLanguage =
                    language === 'hr' ? pathname : pathname.slice(3);
                navigate(
                    `${getLanguagePrefix(
                        newLanguage
                    )}/${pathnameWithoutLanguage}`,
                    { replace: true }
                );
            }
        }
    };

    const getLanguagePrefix = language => {
        switch (language) {
            case 'en':
                return '/en';
            default:
                return '';
        }
    };

    // Currency state
    const [currency, setCurrency] = useState(
        // get currency from localstorage, if not found or SSR set to HRK
        isBrowser() ? window.localStorage.getItem('currency') || 'HRK' : 'HRK'
    );
    const [currencyData, setCurrencyData] = useState({});

    const changeCurrency = currency => {
        setCurrency(currency);
        isBrowser() && window.localStorage.setItem('currency', currency);
    };

    const convertToCurrency = price => {
        const HRK = price / 100;
        const { EUR, BAM, RSD, USD, GBP } = currencyData;

        switch (currency) {
            case 'HRK':
                return `${HRK} kn`;
            case 'EUR':
                return `€${(HRK * EUR).toFixed(2)}`;
            case 'BAM':
                return `${(HRK * BAM).toFixed(2)} BAM`;
            case 'RSD':
                return `${(HRK * RSD).toFixed(2)} RSD`;
            case 'USD':
                return `$${(HRK * USD).toFixed(2)}`;
            case 'GBP':
                return `£${(HRK * GBP).toFixed(2)}`;
        }
    };

    // Cart state
    const [cartVisible, setCartVisible] = useState(false);
    const [cart, setCart] = useState([]);

    const incrementQuantity = id => {
        return setCart(
            cart.map(item =>
                item.id === id && item.quantity < item.maxQuantity
                    ? { ...item, ...{ quantity: item.quantity + 1 } }
                    : item
            )
        );
    };

    const removeFromCart = id => {
        return setCart(cart.filter(item => item.id !== id));
    };

    const decrementQuantity = id => {
        // if decrementing item with quantity 1 then remove item
        if (cart.find(e => e.id === id).quantity === 1) {
            return removeFromCart(id);
        }

        return setCart(
            cart.map(item =>
                item.id === id && item.quantity > 1
                    ? { ...item, ...{ quantity: item.quantity - 1 } }
                    : item
            )
        );
    };

    const addToCart = item => {
        // if item is already in cart increment quantity
        if (cart.some(e => e.id === item.id)) {
            return incrementQuantity(item.id);
        }

        return setCart([
            ...cart,
            { ...item, ...{ maxQuantity: item.quantity, quantity: 1 } },
        ]);
    };

    const getQuantity = (id, quantity) => {
        const item = cart.find(item => item.id === id);

        if (item) {
            return quantity - item.quantity;
        }
        return quantity;
    };

    // Search state
    const [searchVisible, setSearchVisible] = useState(false);
    const [searchData, setSearchData] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [query, setQuery] = useState('');
    const defaultAvailableCategories = {
        brands: [],
        types: [],
        prices: {
            min: 0,
            max: 0,
        },
    };
    const [availableCategories, setAvailableCategories] = useState(
        defaultAvailableCategories
    );
    const defaultSelectedCategories = {
        brand: '',
        type: {
            hr: '',
            en: '',
        },
        price: {
            min: 0,
            max: 0,
        },
    };
    const [selectedCategory, setSelectedCategory] = useState(
        defaultSelectedCategories
    );

    const searchOptions = {
        shouldSort: true,
        threshold: 0.33,
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        minMatchCharLength: 2,
        keys: [
            { name: `name.${language}`, weight: 1 },
            { name: 'id', weight: 1 },
            { name: 'brand', weight: 0.85 },
            { name: `type.${language}`, weight: 0.85 },
        ],
    };

    const fuse = new Fuse(searchData, searchOptions);

    useEffect(() => {
        if (query) {
            const results = [...fuse.search(query)];

            setSearchResults(results);
            setAvailableCategories(calculateCategories(results));
            setSelectedCategory(defaultSelectedCategories);
        } else {
            setSearchResults([]);
            setAvailableCategories(defaultAvailableCategories);
            setSelectedCategory(defaultSelectedCategories);
        }
    }, [searchData, query]);

    useEffect(() => {
        const { type, brand, price } = selectedCategory;
        setSearchResults(results =>
            results.map(result => {
                if (
                    (type[language] &&
                        type[language] !== result.type[language]) ||
                    (brand && brand !== result.brand) ||
                    (price.min && price.min > result.price) ||
                    (price.max && price.max < result.price)
                ) {
                    result.hidden = true;
                } else {
                    result.hidden = false;
                }

                return result;
            })
        );
    }, [selectedCategory]);

    const calculateCategories = results => {
        const brands = [];
        const types = [];
        const prices = {
            min: 0,
            max: 0,
        };

        results.forEach(({ type, brand, price }) => {
            const brandIndex = brands.findIndex(b => b.name === brand);

            if (brandIndex === -1) {
                brands.push({
                    name: brand,
                    count: 1,
                });
            } else {
                brands[brandIndex].count++;
            }

            const typeIndex = types.findIndex(
                t => t.name[language] === type[language]
            );

            if (typeIndex === -1) {
                types.push({
                    name: type,
                    count: 1,
                });
            } else {
                types[typeIndex].count++;
            }

            if (!prices.min || price < prices.min) prices.min = price;
            if (!prices.max || price > prices.max) prices.max = price;
        });

        return {
            brands,
            types,
            prices,
        };
    };

    return (
        <SharedContext.Provider
            value={{
                currency,
                setCurrency,
                searchData,
                setSearchData,
                currencyData,
                setCurrencyData,
                language,
                setLanguage,
                getLanguagePrefix,
                convertToCurrency,
                cart,
                setCart,
                incrementQuantity,
                removeFromCart,
                decrementQuantity,
                addToCart,
                getQuantity,
                cartVisible,
                setCartVisible,
                searchVisible,
                setSearchVisible,
                changeLanguage,
                changeCurrency,
                searchResults,
                query,
                setQuery,
                availableCategories,
                selectedCategory,
                setSelectedCategory,
            }}
        >
            {children}
        </SharedContext.Provider>
    );
};
