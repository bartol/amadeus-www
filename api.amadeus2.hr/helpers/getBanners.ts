import fetch from 'node-fetch';

const bannersListURL = 'https://amadeus-images.s3.amazonaws.com/banners.json';

export const getBanners = async () => {
  try {
    const bannersList = await fetch(bannersListURL).then(res => res.json());

    return bannersList;
  } catch (e) {
    console.log(e);
  }
};
