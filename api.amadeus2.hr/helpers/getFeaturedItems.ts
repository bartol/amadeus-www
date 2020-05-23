import fetch from 'node-fetch';
import { getItems } from './getItems';

const featuredListURL = 'https://amadeus-images.s3.amazonaws.com/featured.json';

export const getFeaturedItems = async () => {
  try {
    const featuredList = await fetch(featuredListURL).then(res => res.json());
    const items = await getItems();

    return items.filter(item => featuredList.includes(item.slug));
  } catch (e) {
    console.log(e);
    return new Error('Internal server error.');
  }
};
