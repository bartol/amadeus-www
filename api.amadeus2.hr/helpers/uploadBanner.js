const AWS = require('aws-sdk');
const uuidv4 = require('uuid/v4');
const s3 = new AWS.S3();
const fetch = require('node-fetch');

const bannersListURL = 'https://amadeus-images.s3.amazonaws.com/banners.json';

export const uploadBanner = async (base64, platform, link) => {
  let bannersList;
  try {
    bannersList = await fetch(bannersListURL).then(res => res.json());
  } catch (e) {
    throw new Error(e);
  }

  const Body = new Buffer(
    base64.replace(/^data:image\/\w+;base64,/, ''),
    'base64',
  );

  if (platform === 'mobile') {
    const Key = `banner-mobile-${uuidv4()}.jpeg`;

    const params = {
      Bucket: 'amadeus-images',
      Key,
      Body,
      ContentEncoding: 'base64',
      ContentType: 'image/jpeg',
    };

    try {
      await s3.putObject(params).promise();
    } catch (e) {
      throw new Error(e);
    }

    bannersList.mobile.push({
      link,
      src: `https://amadeus-images.s3.amazonaws.com/${Key}`,
    });

    console.log(bannersList);

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
  }

  if (platform === 'desktop') {
    const Key = `banner-desktop-${uuidv4()}.jpeg`;

    const params = {
      Bucket: 'amadeus-images',
      Key,
      Body,
      ContentEncoding: 'base64',
      ContentType: 'image/jpeg',
    };

    try {
      await s3.putObject(params).promise();
    } catch (e) {
      throw new Error(e);
    }

    bannersList.desktop.push({
      link,
      src: `https://amadeus-images.s3.amazonaws.com/${Key}`,
    });

    console.log(bannersList);

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
  }

  return 'failure';
};
