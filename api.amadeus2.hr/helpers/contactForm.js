import * as AWS from 'aws-sdk';

export const contactForm = async (email, content) => {
  const customer_params = {
    Source: process.env.FORM_SEND_EMAIL,
    Destination: { ToAddresses: [email] },
    ReplyToAddresses: [process.env.FORM_RECEIVE_EMAIL],
    Message: {
      Body: {
        Text: {
          Charset: 'UTF-8',
          Data: `Vaša poruka:\n\n${content}\n\nZa više informacija kontaktirajte nas na ${process.env.FORM_RECEIVE_EMAIL}`,
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: 'Vaša poruka sa Amadeus kontakt forme',
      },
    },
  };

  const internal_params = {
    Source: process.env.FORM_SEND_EMAIL,
    Destination: { ToAddresses: [process.env.FORM_RECEIVE_EMAIL] },
    ReplyToAddresses: [email],
    Message: {
      Body: {
        Text: {
          Charset: 'UTF-8',
          Data: `Poruka poslana sa ${email}:\n\n${content}`,
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: 'Nova poruka sa Amadeus kontakt forme',
      },
    },
  };

  const ses = new AWS.SES();

  try {
    await ses.sendEmail(customer_params).promise();
    await ses.sendEmail(internal_params).promise();
    return 'success';
  } catch {
    return 'failure';
  }
};
