import React, { useContext } from 'react';
import { SharedContext } from '../state/shared';
import { Card } from '../components/card';

export const Search = () => {
    const {
        language,
        searchVisible,
        setSearchVisible,
        query,
        setQuery,
        availableCategories,
        selectedCategory,
        setSelectedCategory,
        searchResults,
    } = useContext(SharedContext);

    return (
        <div
            className={`overlay ${searchVisible ? 'visible' : 'hidden'}`}
            onClick={e => {
                // if overlay and not its children is clicked
                if (e.target === e.currentTarget) {
                    setSearchVisible(false);
                }
            }}
        >
            <div className='search'>
                {/* FIXME i18n */}
                <input
                    type='text'
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder='Search'
                />
                <button type='button' onClick={() => setSearchVisible(false)}>
                    {/* FIXME add icon */}
                    exit
                </button>
                <pre>{JSON.stringify(availableCategories, null, 2)}</pre>
                <pre>{JSON.stringify(selectedCategory, null, 2)}</pre>
                <ul>
                    {availableCategories.types.map(type => {
                        return (
                            <li
                                onClick={() =>
                                    type.name[language] !==
                                    selectedCategory.type[language]
                                        ? setSelectedCategory({
                                              ...selectedCategory,
                                              type: type.name,
                                          })
                                        : setSelectedCategory({
                                              ...selectedCategory,
                                              type: {
                                                  hr: '',
                                                  en: '',
                                              },
                                          })
                                }
                                key={type.name[language]}
                            >
                                {type.name[language]} ({type.count})
                            </li>
                        );
                    })}
                </ul>
                <ul>
                    {availableCategories.brands.map(brand => {
                        return (
                            <li
                                onClick={() =>
                                    brand.name !== selectedCategory.brand
                                        ? setSelectedCategory({
                                              ...selectedCategory,
                                              brand: brand.name,
                                          })
                                        : setSelectedCategory({
                                              ...selectedCategory,
                                              brand: '',
                                          })
                                }
                                key={brand.name}
                            >
                                {brand.name} ({brand.count})
                            </li>
                        );
                    })}
                </ul>
                <ul>
                    {searchResults.map(item => {
                        return (
                            <Card
                                name={item.name}
                                price={item.price}
                                discountedPrice={item.discountedPrice}
                                image={item.images[0]}
                                type={item.type}
                                quantity={item.quantity}
                                availability={item.availability}
                                slug={item.slug}
                                id={item.id}
                                hidden={item.hidden}
                                key={item.id}
                            />
                        );
                    })}
                </ul>
            </div>
        </div>
    );
};
