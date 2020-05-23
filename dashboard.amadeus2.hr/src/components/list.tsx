import React, { useState, useEffect } from 'react';
import Fuse from 'fuse.js';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { GET_ITEMS } from '../queries/GET_ITEMS';
import { DELETE_ITEM } from '../queries/DELETE_ITEM';
import { Link } from 'react-router-dom';

const options = {
  shouldSort: true,
  includeScore: true,
  includeMatches: true,
  threshold: 0.33,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 2,
  keys: [{ name: 'name.hr', weight: 1 }],
};

export const List = () => {
  const { loading, error, data } = useQuery(GET_ITEMS, {
    fetchPolicy: 'cache-and-network',
  });

  const [deleteItem] = useMutation(DELETE_ITEM);

  const [allResults, setAllResults] = useState([]);

  useEffect(() => {
    if (data) {
      setAllResults(
        data.items.map((item: any) => {
          return {
            ...item,
            deleteSelected: false,
          };
        }),
      );
    }
  }, [data]);

  const [results, setResults] = useState(allResults);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const fuse = new Fuse(allResults, options);
    // @ts-ignore
    setResults(query ? fuse.search(query).map(i => i.item) : allResults);
  }, [query, allResults]);

  if (loading) return <p>Loading...</p>;
  if (error) return <h1>{error.message}</h1>;

  return (
    <main>
      <section className='listFilters'>
        <Link to='/create/' className='link'>
          Novi proizvod
        </Link>
        <input
          type='search'
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder='Search'
          className='search'
        />
        <button
          type='button'
          onClick={() => {
            allResults.forEach((result: any) => {
              if (result.deleteSelected) {
                deleteItem({
                  variables: {
                    id: result.id,
                  },
                });

                setResults((results: any) => {
                  return results.filter((r: any) => r.id !== result.id);
                });
                setAllResults((allResults: any) => {
                  return allResults.filter((r: any) => r.id !== result.id);
                });
              }
            });
            console.log();
          }}
          className='link delete'
        >
          Obriši označene
        </button>
      </section>
      <section>
        {results.map((item: any) => {
          return (
            <div className='listItemWrapper' key={item.id}>
              <Link to={`/item/${item.id}`}>
                <img
                  src={item.images[0].src}
                  className='listItemImage'
                  alt={`${item.name}`}
                />
              </Link>
              <div className='spacebetween'>
                <Link to={`/item/${item.id}`}>
                  <div>
                    <h2 className='listItemTitle'>{item.name.hr}</h2>
                    {item.price === item.discountedPrice ? (
                      <h3 className='listItemPrice'>{item.price / 100} kn</h3>
                    ) : (
                      <div>
                        <h3 className='listItemPriceOld'>
                          {item.price / 100} kn
                        </h3>
                        <h3 className='listItemPriceDiscounted'>
                          {item.discountedPrice / 100} kn
                          <p>
                            ({(item.price - item.discountedPrice) / 100}kn,{' '}
                            <span>
                              {100 -
                                Math.round(
                                  (item.discountedPrice / item.price) * 100,
                                )}
                              %
                            </span>
                            )
                          </p>
                        </h3>
                      </div>
                    )}
                    <h4 className='listItemParams'>
                      <span>Količina:</span> {item.quantity}
                    </h4>
                    <h4 className='listItemParams'>
                      <span>Dostupnost:</span> {item.availability.hr}
                    </h4>
                  </div>
                </Link>
                <label className='delCheckbox'>
                  Označi
                  <input
                    type='checkbox'
                    checked={item.deleteSelected}
                    onChange={e => {
                      const { target } = e;
                      setResults((results: any) => {
                        return results.map((result: any) => {
                          if (result.id === item.id) {
                            return {
                              ...result,
                              deleteSelected: target.checked,
                            };
                          }
                          return result;
                        });
                      });
                      setAllResults((allResults: any) => {
                        return allResults.map((result: any) => {
                          if (result.id === item.id) {
                            return {
                              ...result,
                              deleteSelected: target.checked,
                            };
                          }
                          return result;
                        });
                      });
                    }}
                  />
                </label>
              </div>
            </div>
          );
        })}
      </section>
    </main>
  );
};
