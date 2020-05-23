const AWS = require('aws-sdk');
const s3 = new AWS.S3();

export const updateFile = async (type, json) => {
  const Key = `${type}.json`;

  const del_params = {
    Bucket: 'amadeus-images',
    Key,
  };

  try {
    await s3.deleteObject(del_params).promise();
  } catch (e) {
    throw new Error(e);
  }

  const add_params = {
    Bucket: 'amadeus-images',
    Key,
    Body: json,
  };

  try {
    await s3.putObject(add_params).promise();
  } catch (e) {
    throw new Error(e);
  }

  return 'success';
};
