import isEmail from 'validator/lib/isEmail';
import { dynamodb } from '../libs/dynamodb';

export const newsletterSubscribe = async email => {
  if (!isEmail(email)) {
    return 'failure';
  }

  const params = {
    TableName: process.env.EMAILS_TABLE,
    Item: {
      email,
      newsletter: true,
    },
  };

  try {
    await dynamodb('put', params);
    return 'success';
  } catch {
    return 'failure';
  }
};
