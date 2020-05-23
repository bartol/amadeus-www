import React, { useEffect, useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { UPDATE_AVAILABILITY } from '../queries/UPDATE_AVAILABILITY';
import { UPDATE_TYPES } from '../queries/UPDATE_TYPES';
import { UPDATE_BRANDS } from '../queries/UPDATE_BRANDS';

export default () => {
  const [settings, setSettings] = useState({
    availability: [],
    types: [],
    brands: [],
  });

  const [updateAvailability, { data: update_availability_data }] = useMutation(
    UPDATE_AVAILABILITY,
  );
  const [updateTypes, { data: update_types_data }] = useMutation(UPDATE_TYPES);
  const [updateBrands, { data: update_brands_data }] = useMutation(
    UPDATE_BRANDS,
  );

  const fetchSetting = async setting => {
    return await fetch(
      `https://amadeus-images.s3.amazonaws.com/${setting}.json`,
    ).then(res => res.json());
  };

  const fetchAll = async () => {
    setSettings({
      availability: await fetchSetting('availability'),
      types: await fetchSetting('types'),
      brands: await fetchSetting('brands'),
    });
  };

  useEffect(() => {
    async function fn() {
      await fetchAll();
    }
    fn();
  }, []);

  return (
    <div>
      <h2>Dostupnost</h2>
      {settings.availability.messages && (
        <textarea
          rows={10}
          cols={100}
          value={settings.availability.messages
            .map(a => a.hr + '/' + a.en)
            .join(',')}
          onChange={e => {
            const messages = e.target.value.split(',').map(item => {
              const [hr, en] = item.split('/');
              return { hr, en };
            });

            setSettings({
              ...settings,
              availability: {
                messages,
              },
            });
          }}
        />
      )}
      <br />
      <button
        type='button'
        onClick={() => {
          updateAvailability({
            variables: {
              json: JSON.stringify(settings.availability),
            },
          });
        }}
        className='linkBtn link addImgBtn'
      >
        Submit
      </button>
      {update_availability_data && update_availability_data.updateAvailability}
      <h2>Kategorije</h2>
      {settings.types.types && (
        <textarea
          rows={10}
          cols={100}
          value={settings.types.types.map(a => a.hr + '/' + a.en).join(',')}
          onChange={e => {
            const types = e.target.value.split(',').map(item => {
              const [hr, en] = item.split('/');
              return { hr, en };
            });

            setSettings({
              ...settings,
              types: {
                types,
              },
            });
          }}
        />
      )}
      <br />
      <button
        type='button'
        onClick={() => {
          updateTypes({
            variables: {
              json: JSON.stringify(settings.types),
            },
          });
        }}
        className='linkBtn link addImgBtn'
      >
        Submit
      </button>
      {update_types_data && update_types_data.updateTypes}
      <h2>Brandovi</h2>
      {settings.brands.brands && (
        <textarea
          rows={10}
          cols={100}
          value={settings.brands.brands.join(',')}
          onChange={e => {
            const brands = e.target.value.split(',');
            setSettings({
              ...settings,
              brands: {
                brands,
              },
            });
          }}
        />
      )}
      <br />
      <button
        type='button'
        onClick={() => {
          updateBrands({
            variables: {
              json: JSON.stringify(settings.brands),
            },
          });
        }}
        className='linkBtn link addImgBtn'
      >
        Submit
      </button>
      {update_brands_data && update_brands_data.updateBrands}
    </div>
  );
};
