const AWS = require('aws-sdk');
const uuidv4 = require('uuid/v4');
const s3 = new AWS.S3();
const fetch = require('node-fetch');

const bannersListURL = 'https://amadeus-images.s3.amazonaws.com/banners.json';

export const deleteBanner = async (src, platform) => {
  let bannersList;
  try {
    bannersList = await fetch(bannersListURL).then(res => res.json());
  } catch (e) {
    throw new Error(e);
  }

  bannersList[platform] = bannersList[platform].filter(b => b.src !== src);

  const del_params = {
    Bucket: 'amadeus-images',
    Key: 'banners.json',
  };

  try {
    await s3.deleteObject(del_params).promise();
  } catch (e) {
    throw new Error(e);
  }

  const add_params = {
    Bucket: 'amadeus-images',
    Key: 'banners.json',
    Body: JSON.stringify(bannersList),
  };

  try {
    await s3.putObject(add_params).promise();
  } catch (e) {
    throw new Error(e);
  }

  return 'success';
};
