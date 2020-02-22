import React, { useContext, useRef, useEffect } from 'react';
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

    const search_input = useRef(null);

    useEffect(() => {
        if (searchVisible) {
            search_input.current.focus();
        }
    }, [searchVisible]);

    return (
        <div
            className={`overlay ${searchVisible ? 'visible' : 'hidden'}`}
            onClick={e => {
                // if overlay and not its children is clicked
                if (e.target === e.currentTarget) {
                    setSearchVisible(false);
                    setQuery('');
                }
            }}
        >
            <div className='search'>
                <div className='inputs_wrapper'>
                    <div className='inputs'>
                        {/* FIXME i18n */}
                        <input
                            type='text'
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            placeholder='Search'
                            ref={search_input}
                            onKeyDown={e => {
                                if (e.keyCode === 13) {
                                    search_input.current.blur();
                                }
                            }}
                        />
                        <button
                            type='button'
                            onClick={() => {
                                setSearchVisible(false);
                                setQuery('');
                            }}
                            className='x_button'
                        >
                            <svg
                                xmlns='http://www.w3.org/2000/svg'
                                width='24'
                                height='24'
                                viewBox='0 0 24 24'
                                fill='none'
                                stroke='currentColor'
                                strokeWidth='2'
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                className='feather feather-x'
                            >
                                <line x1='18' y1='6' x2='6' y2='18'></line>
                                <line x1='6' y1='6' x2='18' y2='18'></line>
                            </svg>
                        </button>
                    </div>
                    <div className='select_type_brand'>
                        {/* <ul> */}
                        {/*     {availableCategories.types.map(type => { */}
                        {/*         return ( */}
                        {/*             <li */}
                        {/*                 onClick={() => */}
                        {/*                     type.name[language] !== */}
                        {/*                     selectedCategory.type[language] */}
                        {/*                         ? setSelectedCategory({ */}
                        {/*                               ...selectedCategory, */}
                        {/*                               type: type.name, */}
                        {/*                           }) */}
                        {/*                         : setSelectedCategory({ */}
                        {/*                               ...selectedCategory, */}
                        {/*                               type: { */}
                        {/*                                   hr: '', */}
                        {/*                                   en: '', */}
                        {/*                               }, */}
                        {/*                           }) */}
                        {/*                 } */}
                        {/*                 key={type.name[language]} */}
                        {/*             > */}
                        {/*                 {type.name[language]} ({type.count}) */}
                        {/*             </li> */}
                        {/*         ); */}
                        {/*     })} */}
                        {/* </ul> */}
                        <div className='shown_brands_mobile'>
                            <span className='shown_brands_text'>
                                {/* FIXME i18n */}
                                {selectedCategory.type[language] === ''
                                    ? 'Prikazane kategorije'
                                    : 'Prikazana kategorija'}
                                :
                            </span>
                            <select
                                value={selectedCategory.type[language]}
                                onChange={e =>
                                    setSelectedCategory({
                                        ...selectedCategory,
                                        type: {
                                            [language]: e.target.value,
                                        },
                                    })
                                }
                                className='shown_brands_select'
                            >
                                {/* FIXME i18n */}
                                <option value=''>
                                    Sve ({searchResults.length})
                                </option>
                                {availableCategories.types.map(type => {
                                    return (
                                        <option
                                            value={type.name[language]}
                                            key={type.name[language]}
                                        >
                                            {type.name[language]} ({type.count})
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                        {/* <ul> */}
                        {/*     {availableCategories.brands.map(brand => { */}
                        {/*         return ( */}
                        {/*             <li */}
                        {/*                 onClick={() => */}
                        {/*                     brand.name !== selectedCategory.brand */}
                        {/*                         ? setSelectedCategory({ */}
                        {/*                               ...selectedCategory, */}
                        {/*                               brand: brand.name, */}
                        {/*                           }) */}
                        {/*                         : setSelectedCategory({ */}
                        {/*                               ...selectedCategory, */}
                        {/*                               brand: '', */}
                        {/*                           }) */}
                        {/*                 } */}
                        {/*                 key={brand.name} */}
                        {/*             > */}
                        {/*                 {brand.name} ({brand.count}) */}
                        {/*             </li> */}
                        {/*         ); */}
                        {/*     })} */}
                        {/* </ul> */}
                        <div className='shown_brands_mobile'>
                            <span className='shown_brands_text'>
                                {/* FIXME i18n */}
                                Prikazani brand
                                {selectedCategory.brand === '' ? 'ovi' : ''}:
                            </span>
                            <select
                                value={selectedCategory.brand}
                                onChange={e =>
                                    setSelectedCategory({
                                        ...selectedCategory,
                                        brand: e.target.value,
                                    })
                                }
                                className='shown_brands_select'
                            >
                                {/* FIXME i18n */}
                                <option value=''>
                                    Svi ({searchResults.length})
                                </option>
                                {availableCategories.brands.map(brand => {
                                    return (
                                        <option
                                            value={brand.name}
                                            key={brand.name}
                                        >
                                            {brand.name} ({brand.count})
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                    </div>
                </div>
                <ul
                    className='itemsList'
                    onClick={e => {
                        // if overlay and not its children is clicked
                        if (e.target === e.currentTarget) {
                            setSearchVisible(false);
                            setQuery('');
                        }
                    }}
                >
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
