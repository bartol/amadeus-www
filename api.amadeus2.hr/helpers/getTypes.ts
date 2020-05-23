import fetch from 'node-fetch';

const typesListURL = 'https://amadeus-images.s3.amazonaws.com/categories.json';

export const getTypes = async () => {
  try {
    const typesList = await fetch(typesListURL).then(res => res.json());

    return typesList;
  } catch (e) {
    console.log(e);
  }
};
