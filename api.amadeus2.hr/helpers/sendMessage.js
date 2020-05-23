import * as AWS from 'aws-sdk';
import { dynamodb } from '../libs/dynamodb';
import isEmail from 'validator/lib/isEmail';
const uuidv4 = require('uuid/v4');

export const sendMessage = async (email, message) => {
  if (!isEmail(email)) {
    return 'failure';
  }

  const id = uuidv4();
  const Item = {
    id,
    email,
    message,
  };

  const params = {
    TableName: process.env.FORMS_TABLE,
    Item,
  };

  const emailParams = {
    Source: process.env.FORM_SEND_EMAIL,
    Destination: { ToAddresses: [process.env.FORM_RECEIVE_EMAIL] },
    ReplyToAddresses: [email],
    Message: {
      Body: {
        Text: {
          Charset: 'UTF-8',
          Data: `Message sent from ${email}:\n\n${message}`,
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: 'New message from amadeus contact form',
      },
    },
  };

  const ses = new AWS.SES();

  try {
    await dynamodb('put', params);
    await ses.sendEmail(emailParams).promise();
    return 'success';
  } catch {
    return 'failure';
  }
};
