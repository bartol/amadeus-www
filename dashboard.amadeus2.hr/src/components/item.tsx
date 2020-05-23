import React, { useState, useEffect } from 'react';
import RichTextEditor from 'react-rte';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { GET_ITEM } from '../queries/GET_ITEM';
import { UPDATE_ITEM } from '../queries/UPDATE_ITEM';
// @ts-ignore
import isSnakeCase from 'is-snake-case';
import { Imgs } from './imgs';

const toolbarConfig = {
  display: [
    'INLINE_STYLE_BUTTONS',
    'BLOCK_TYPE_BUTTONS',
    'LINK_BUTTONS',
    'BLOCK_TYPE_DROPDOWN',
    'HISTORY_BUTTONS',
  ],
  INLINE_STYLE_BUTTONS: [
    { label: 'Bold', style: 'BOLD' },
    { label: 'Italic', style: 'ITALIC' },
    { label: 'Strikethrough', style: 'STRIKETHROUGH' },
    { label: 'Monospace', style: 'CODE' },
    { label: 'Underline', style: 'UNDERLINE' },
  ],
  BLOCK_TYPE_DROPDOWN: [
    { label: 'Normal', style: 'unstyled' },
    { label: 'Heading Large', style: 'header-two' },
    { label: 'Heading Medium', style: 'header-three' },
    { label: 'Heading Small', style: 'header-four' },
    { label: 'Code Block', style: 'code-block' },
  ],
  BLOCK_TYPE_BUTTONS: [
    { label: 'UL', style: 'unordered-list-item' },
    { label: 'OL', style: 'ordered-list-item' },
    { label: 'Blockquote', style: 'blockquote' },
  ],
};

const calculateSlug = (name: string) => {
  const slug = name
    .toLowerCase() // convert to lower case
    .replace(/[^\w\s]/g, '') // remove everything that isn't letter or number
    .replace(/([a-z])([A-Z])/g, '$1-$2') // get all lowercase letters that are near to uppercase ones
    .replace(/[\s_]+/g, '_'); // replace all spaces and low dash

  return slug;
};

const calculatePercent = (fullNum: number, num: number) => {
  return parseFloat((100 - (num / fullNum) * 100).toFixed(2));
};

const calculateDiscount = (fullNum: number, percent: number) => {
  return Math.round(((100 - percent) / 100) * fullNum);
};

const updateAvailability = async () => {
  return await fetch(
    'https://amadeus-images.s3.amazonaws.com/availability.json',
  ).then(res => res.json());
};

const updateTypes = async () => {
  return await fetch(
    'https://amadeus-images.s3.amazonaws.com/types.json',
  ).then(res => res.json());
};

const updateBrands = async () => {
  return await fetch(
    'https://amadeus-images.s3.amazonaws.com/brands.json',
  ).then(res => res.json());
};

export const Item = (props: Props) => {
  const [item, setItem] = useState({
    id: props.match.params.id,
    name: {
      hr: '',
      en: '',
      enDisabled: true,
    },
    price: 0,
    discountedPrice: 0,
    discountedPricePercent: 0,
    discountedPriceDisabled: true,
    description: {
      hr: RichTextEditor.createEmptyValue(),
      en: RichTextEditor.createEmptyValue(),
    },
    availability: {
      hr: '',
      en: '',
    },
    slug: {
      hr: '',
      hrCalculated: '',
      hrDisabled: true,
    },
    quantity: 0,
    images: [],
    type: {
      hr: '',
      en: '',
    },
    brand: '',
  });
  const [isReadyToSubmit, setIsReadyToSubmit] = useState(false);

  const [updateItem, { data: mutationData }] = useMutation(UPDATE_ITEM);

  const { loading, error, data } = useQuery(GET_ITEM, {
    variables: {
      id: item.id,
    },
    fetchPolicy: 'cache-and-network',
  });

  const [availabilityList, set_availability_data] = useState({});
  const [typeList, set_types_data] = useState({});
  const [brandList, set_brands_data] = useState([]);

  useEffect(() => {
    async function fn() {
      set_availability_data(await updateAvailability());
      set_types_data(await updateTypes());
      set_brands_data(await updateBrands());
    }
    fn();
  }, []);

  useEffect(() => {
    if (data) {
      const {
        name,
        price,
        discountedPrice,
        description,
        availability,
        slug,
        quantity,
        images,
        type,
        brand,
      } = data.item;

      setItem(item => {
        return {
          ...item,
          name: {
            hr: name.hr,
            en: name.en,
            enDisabled: name.hr === name.en,
          },
          price,
          discountedPrice,
          discountedPricePercent: calculatePercent(price, discountedPrice),
          discountedPriceDisabled: price === discountedPrice,
          description: {
            hr: RichTextEditor.createValueFromString(description.hr, 'html'),
            en: RichTextEditor.createValueFromString(description.en, 'html'),
          },
          availability: {
            hr: availability.hr,
            en: availability.en,
          },
          slug: {
            hr: slug,
            hrCalculated: calculateSlug(name.hr),
            hrDisabled: calculateSlug(name.hr) === slug,
          },
          quantity,
          images,
          type: {
            hr: type.hr,
            en: type.en,
          },
          brand,
        };
      });
    }
  }, [data]);

  useEffect(() => {
    setItem(item => {
      return {
        ...item,
        slug: {
          ...item.slug,
          hr: item.slug.hrDisabled ? calculateSlug(item.name.hr) : item.slug.hr,
          hrCalculated: calculateSlug(item.name.hr),
        },
      };
    });
  }, [item.name.hr, item.name.en]);

  useEffect(() => {
    if (
      item.name.hr &&
      (item.name.enDisabled ? true : item.name.en) &&
      item.price &&
      (item.discountedPriceDisabled ? true : item.discountedPrice) &&
      item.description.hr.toString('html') !== `<p><br></p>` &&
      item.description.en.toString('html') !== `<p><br></p>` &&
      item.availability.hr &&
      item.availability.en &&
      item.quantity >= 0 &&
      item.type.hr &&
      item.type.hr &&
      item.brand &&
      (item.slug.hrDisabled ? true : isSnakeCase(item.slug.hr)) &&
      item.images.length
    ) {
      setIsReadyToSubmit(true);
    } else {
      setIsReadyToSubmit(false);
    }
  }, [item]);

  if (loading) return <p>Loading...</p>;
  if (error)
    return (
      <div>
        <h1>{error.message}</h1>
        <p>Check url.</p>
      </div>
    );

  return (
    <div className='wrapper'>
      <div className='content'>
        <h1>{item.name.hr}</h1>
        <p>id: {item.id}</p>
        <h2>Ime</h2>
        <div className='nameFields'>
          <label>
            HR:
            <br />
            <input
              type='text'
              value={item.name.hr}
              onChange={e =>
                setItem({
                  ...item,
                  name: {
                    ...item.name,
                    hr: e.target.value,
                  },
                })
              }
              className={item.name.hr ? 'validInput' : 'invalidInput'}
            />
          </label>
          <div className='optionalName'>
            <input
              type='checkbox'
              checked={!item.name.enDisabled}
              onChange={e =>
                setItem({
                  ...item,
                  name: {
                    ...item.name,
                    enDisabled: !e.target.checked,
                  },
                })
              }
            />
            <label>
              EN: (opt.)
              <br />
              <input
                type='text'
                value={item.name.enDisabled ? item.name.hr : item.name.en}
                disabled={item.name.enDisabled}
                onChange={e =>
                  setItem({
                    ...item,
                    name: {
                      ...item.name,
                      en: e.target.value,
                    },
                  })
                }
                className={
                  item.name.enDisabled
                    ? undefined
                    : item.name.en
                    ? 'validInput'
                    : 'invalidInput'
                }
              />
            </label>
          </div>
        </div>
        <h2>Cijena</h2>
        <div className='priceFields'>
          <label>
            Cijena (HRK)
            <br />
            <input
              type='number'
              min='0'
              step='0.01'
              value={item.price / 100}
              onChange={e => {
                setItem({
                  ...item,
                  price: Math.floor(parseFloat(e.target.value) * 100),
                });
              }}
              className={item.price ? 'validInput' : 'invalidInput'}
            />
          </label>
          <div className='optionalName'>
            <input
              type='checkbox'
              checked={!item.discountedPriceDisabled}
              onChange={e =>
                setItem({
                  ...item,
                  discountedPriceDisabled: !e.target.checked,
                })
              }
            />
            <label>
              Cijena s popustom (HRK) (opt.)
              <br />
              <input
                type='number'
                min='0'
                step='0.01'
                value={
                  item.discountedPriceDisabled
                    ? item.price / 100
                    : item.discountedPrice / 100
                }
                disabled={item.discountedPriceDisabled}
                onChange={e => {
                  setItem({
                    ...item,
                    discountedPrice: Math.floor(
                      parseFloat(e.target.value) * 100,
                    ),
                    discountedPricePercent: calculatePercent(
                      item.price,
                      Math.floor(parseFloat(e.target.value) * 100),
                    ),
                  });
                }}
                className={
                  item.discountedPriceDisabled
                    ? undefined
                    : item.discountedPrice
                    ? 'validInput'
                    : 'invalidInput'
                }
              />
              <span className='ili'>ili</span>
              <input
                type='number'
                min='0'
                max='100'
                step='0.01'
                value={
                  item.discountedPriceDisabled ? 0 : item.discountedPricePercent
                }
                disabled={item.discountedPriceDisabled}
                onChange={e => {
                  setItem({
                    ...item,
                    discountedPrice: calculateDiscount(
                      item.price,
                      parseFloat(e.target.value),
                    ),
                    discountedPricePercent: parseFloat(e.target.value),
                  });
                }}
                className={`discountPercentInput ${
                  item.discountedPriceDisabled
                    ? undefined
                    : item.discountedPricePercent >= 0 &&
                      item.discountedPricePercent <= 100
                    ? 'validInput'
                    : 'invalidInput'
                }`}
              />
              <span className='percentSymbol'>%</span>
            </label>
          </div>
        </div>
        <h2>Opis</h2>
        <div className='editors'>
          <div className='editor'>
            <p>HR:</p>
            <RichTextEditor
              value={item.description.hr}
              onChange={value =>
                setItem({
                  ...item,
                  description: {
                    ...item.description,
                    hr: value,
                  },
                })
              }
              placeholder='opis (HR)'
              // @ts-ignore
              toolbarConfig={toolbarConfig}
              className={
                item.description.hr.toString('html') !== `<p><br></p>`
                  ? 'validInput'
                  : 'invalidInput'
              }
            />
          </div>
          <div className='editor'>
            <p>EN:</p>
            <RichTextEditor
              value={item.description.en}
              onChange={value =>
                setItem({
                  ...item,
                  description: {
                    ...item.description,
                    en: value,
                  },
                })
              }
              placeholder='opis (EN)'
              // @ts-ignore
              toolbarConfig={toolbarConfig}
              className={
                item.description.en.toString('html') !== `<p><br></p>`
                  ? 'validInput'
                  : 'invalidInput'
              }
            />
          </div>
        </div>
        <h2>Dostupnost</h2>
        <select
          onChange={e => {
            const [hr, en] = e.target.value.split('|||');
            setItem({
              ...item,
              availability: {
                hr,
                en,
              },
            });
          }}
          value={
            item.availability.hr && item.availability.en
              ? `${item.availability.hr}|||${item.availability.en}`
              : 'default'
          }
          className={
            item.availability.hr && item.availability.en
              ? 'Select validInput'
              : 'Select invalidInput'
          }
        >
          <option value='default' disabled>
            Odaberi dostupnost
          </option>

          {availabilityList &&
            // @ts-ignore
            availabilityList.messages &&
            // @ts-ignore
            availabilityList.messages.map(message => {
              const { hr, en } = message;
              const display = `${hr} / ${en}`;
              const value = `${hr}|||${en}`;
              return (
                <option value={value} key={value}>
                  {display}
                </option>
              );
            })}
        </select>
        <h2>Količina</h2>
        <label>
          (kom.)
          <br />
          <input
            type='number'
            min='0'
            value={item.quantity}
            onChange={e => {
              setItem({
                ...item,
                quantity: parseInt(e.target.value),
              });
            }}
            className={item.quantity >= 0 ? 'validInput' : 'invalidInput'}
          />
        </label>
        <h2>Vrsta</h2>
        <select
          onChange={e => {
            const [hr, en] = e.target.value.split('|||');
            setItem({
              ...item,
              type: {
                hr,
                en,
              },
            });
          }}
          value={
            item.type.hr && item.type.en
              ? `${item.type.hr}|||${item.type.en}`
              : 'default'
          }
          className={
            item.type.hr && item.type.en
              ? 'Select validInput'
              : 'Select invalidInput'
          }
        >
          <option value='default' disabled>
            Odaberi vrstu
          </option>
          {typeList &&
            // @ts-ignore
            typeList.types &&
            // @ts-ignore
            typeList.types.map(type => {
              const { hr, en } = type;
              const display = `${hr} / ${en}`;
              const value = `${hr}|||${en}`;
              return (
                <option value={value} key={value}>
                  {display}
                </option>
              );
            })}
        </select>
        <h2>Proizvođač</h2>
        <select
          onChange={e => {
            setItem({
              ...item,
              brand: e.target.value,
            });
          }}
          value={item.brand || 'default'}
          className={item.brand ? 'Select validInput' : 'Select invalidInput'}
        >
          <option value='default' disabled>
            Odaberi proizvođača
          </option>

          {brandList &&
            // @ts-ignore
            brandList.brands &&
            // @ts-ignore
            brandList.brands.map(brand => {
              return (
                <option value={brand} key={brand}>
                  {brand}
                </option>
              );
            })}
        </select>
        <h2>URL</h2>
        <div className='slugFields'>
          <div className='optionalSlug'>
            <input
              type='checkbox'
              checked={!item.slug.hrDisabled}
              onChange={e =>
                setItem({
                  ...item,
                  slug: {
                    ...item.slug,
                    hrDisabled: !e.target.checked,
                  },
                })
              }
            />
            <label>
              (opt.)
              <br />
              <input
                type='text'
                value={
                  item.slug.hrDisabled ? item.slug.hrCalculated : item.slug.hr
                }
                disabled={item.slug.hrDisabled}
                onChange={e =>
                  setItem({
                    ...item,
                    slug: {
                      ...item.slug,
                      hr: e.target.value,
                    },
                  })
                }
                className={
                  !item.slug.hrDisabled
                    ? isSnakeCase(item.slug.hr)
                      ? 'validInput'
                      : 'invalidInput'
                    : undefined
                }
              />
            </label>
          </div>
          <div className='optionalSlug'>
            <div>
              <strong>HR URL:</strong> https://amadeus2.hr/{item.type.hr}/
              {item.slug.hr}
              <br />
              <strong>EN URL:</strong> https://amadeus2.hr/en/{item.type.en}/
              {item.slug.hr}
            </div>
          </div>
        </div>
        <h2>Slike</h2>
        <Imgs item={item} setItem={setItem} />
        <div className='submitWrapper'>
          {!isReadyToSubmit && <h3>Problemi:</h3>}
          <ol>
            {item.name.hr &&
            (item.name.enDisabled ? true : item.name.en) ? null : (
              <li>Proizvod mora imati valjano ime.</li>
            )}
            {item.price &&
            (item.discountedPriceDisabled
              ? true
              : item.discountedPrice) ? null : (
              <li>Proizvod mora imati valjanu cijenu.</li>
            )}
            {item.description.hr.toString('html') !== `<p><br></p>` &&
            item.description.en.toString('html') !== `<p><br></p>` ? null : (
              <li>Proizvod mora imati valjan opis.</li>
            )}
            {item.availability.hr && item.availability.en ? null : (
              <li>Proizvod mora imati valjanu dostupnost.</li>
            )}
            {item.quantity >= 0 ? null : <li>Količina mora biti broj.</li>}
            {item.type.hr && item.type.en ? null : (
              <li>Proizvod mora imati valjanu vrstu.</li>
            )}
            {item.brand ? null : (
              <li>Proizvod mora imati valjanog proizvođača.</li>
            )}
            {(item.slug.hrDisabled ? (
              true
            ) : (
              isSnakeCase(item.slug.hr)
            )) ? null : (
              <li>Proizvod mora imati valjan url.</li>
            )}
            {item.images.length ? null : (
              <li>Proizvod mora imati minimalno 1 sliku.</li>
            )}
          </ol>
          <button
            type='submit'
            disabled={!isReadyToSubmit}
            className='link linkBtn'
            onClick={() => {
              updateItem({
                variables: {
                  input: {
                    id: item.id,
                    name: {
                      hr: item.name.hr,
                      en: item.name.enDisabled ? item.name.hr : item.name.en,
                    },
                    price: item.price,
                    discountedPrice: item.discountedPriceDisabled
                      ? item.price
                      : item.discountedPrice,
                    description: {
                      hr: item.description.hr.toString('html'),
                      en: item.description.en.toString('html'),
                    },
                    availability: {
                      hr: item.availability.hr,
                      en: item.availability.en,
                    },
                    slug: item.slug.hrDisabled
                      ? calculateSlug(item.name.hr)
                      : item.slug.hr,
                    quantity: item.quantity,
                    images: item.images.map((image: any) => {
                      return {
                        src: image.src,
                        index: image.index,
                      };
                    }),
                    type: {
                      hr: item.type.hr,
                      en: item.type.en,
                    },
                    brand: item.brand,
                  },
                },
              });
            }}
          >
            Submit update
          </button>
          {mutationData && mutationData.update.id === item.id && 'item updated'}
        </div>
      </div>
    </div>
  );
};

interface Props {
  match: {
    params: {
      id: string;
    };
  };
}
