import * as AWS from 'aws-sdk';

export const sendReceipt = async (email, message) => {
  const emailParams = {
    Source: process.env.FORM_SEND_EMAIL,
    Destination: { ToAddresses: [process.env.FORM_RECEIVE_EMAIL] },
    ReplyToAddresses: [email],
    Message: {
      Body: {
        Text: {
          Charset: 'UTF-8',
          Data: message,
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: 'New order on amadeus2.hr',
      },
    },
  };

  const customer_emailParams = {
    Source: process.env.FORM_SEND_EMAIL,
    Destination: { ToAddresses: [email] },
    ReplyToAddresses: [process.env.FORM_RECEIVE_EMAIL],
    Message: {
      Body: {
        Text: {
          Charset: 'UTF-8',
          Data: message,
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: 'Vaša narudžba na Amadeus 2 Webshop-u',
      },
    },
  };

  const ses = new AWS.SES();

  try {
    await ses.sendEmail(emailParams).promise();
    await ses.sendEmail(customer_emailParams).promise();
    return 'success';
  } catch {
    return 'failure';
  }
};
