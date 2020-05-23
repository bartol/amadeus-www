const AWS = require('aws-sdk');
const uuidv4 = require('uuid/v4');
const s3 = new AWS.S3();

export const uploadImage = async (base64: string, name: string) => {
  const Key = name ? `${name}-${uuidv4()}.jpeg` : `${uuidv4()}.jpeg`;
  const Body = new Buffer(
    base64.replace(/^data:image\/\w+;base64,/, ''),
    'base64',
  );

  const params = {
    Bucket: 'amadeus-images',
    Key,
    Body,
    ContentEncoding: 'base64',
    ContentType: 'image/jpeg',
  };

  try {
    await s3.putObject(params).promise();
    return `https://amadeus-images.s3.amazonaws.com/${Key}`;
  } catch (e) {
    throw new Error(e);
  }
};
