import React from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { GET_ITEMS } from '../queries/GET_ITEMS';
import { UPDATE_FEATURED } from '../queries/UPDATE_FEATURED';

export default () => {
  const { loading, error, data } = useQuery(GET_ITEMS, {
    fetchPolicy: 'cache-and-network',
  });

  const [items, setItems] = React.useState([]);

  React.useEffect(() => {
    async function fn() {
      const featured_data = await fetch(
        'https://amadeus-images.s3.amazonaws.com/featured.json',
      ).then(data => data.json());
      const items = featured_data.filter(slug =>
        data.items.map(i => i.slug).includes(slug),
      );
      setItems(items);
    }
    fn();
  }, [data.items]);

  const [updateFeatured, { data: update_featured }] = useMutation(
    UPDATE_FEATURED,
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <h1>{error.message}</h1>;

  return (
    <div>
      <ul>
        {items.map(slug => {
          const item = data.items.filter(item => item.slug === slug)[0];
          return item ? (
            <li key={item.id}>
              {item.name.hr}
              <button
                type='button'
                onClick={() => setItems(items.filter(i => i !== item.slug))}
              >
                x
              </button>
            </li>
          ) : null;
        })}
      </ul>
      <select
        defaultValue='disabled'
        onChange={e => {
          setItems([...items, e.target.value]);
        }}
        className='Select'
      >
        <option disabled value='disabled'>
          Dodaj proizvod
        </option>
        {data.items.map(item => (
          <option
            disabled={items.includes(item.slug)}
            value={item.slug}
            key={item.slug}
          >
            {item.name.hr}
          </option>
        ))}
      </select>
      <button
        type='button'
        onClick={() => {
          updateFeatured({
            variables: {
              json: JSON.stringify(items),
            },
          });
        }}
        className='linkBtn link addImgBtn'
      >
        Submit
      </button>
      {update_featured && update_featured.updateFeaturedItems}
    </div>
  );
};
