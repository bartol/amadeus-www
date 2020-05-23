import { ValidationError } from 'apollo-server-lambda';
import { asyncForEach } from '../libs/asyncForEach';
import { dynamodb } from '../libs/dynamodb';
import { createHash } from 'crypto';

interface SignatureInput {
  order: string[];
  name: string;
  email: string;
  newsletter: boolean;
  language: string;
}

export const getSignature = async ({
  order,
  language,
}: SignatureInput) => {
  /*      checking passed values      */

  if (language !== 'hr' && language !== 'en') {
    return new ValidationError('Language not valid.');
  }

  if (!order.length) {
    return new ValidationError('Cart is empty.');
  }

  /*      get data from database      */

  const items = [];

  await asyncForEach(order, async (id: string) => {
    const params = {
      TableName: process.env.ITEMS_TABLE,
      Key: {
        id,
      },
    };

    try {
      const result = await dynamodb('get', params);

      const { name, discountedPrice } = result.Item;

      items.push({
        name,
        price: discountedPrice,
        id,
      });
    } catch {
      return new ValidationError('Item(s) in cart not valid.');
    }
  });

  if (order.length !== items.length) {
    return new ValidationError('Item(s) in cart not valid.');
  }

  /*      constant values      */

  const shop_id = process.env.SHOP_ID;
  const success_url = 'https://api.amadeus2.hr/success';
  const failure_url = 'https://api.amadeus2.hr/failure';
  const cancel_url = 'https://api.amadeus2.hr/cancel';

  const secret_key = process.env.SECRET_KEY;

  /*      calculate price      */

  let amount = 0;

  items.forEach(item => {
    amount += item.price;
  });

  const base = amount.toString().slice(0, -2);
  const part = amount.toString().slice(-2);
  const price = base + ',' + part;

  /*      calculate order      */

  /*      calculate signature      */
  const cart_id = 'Amadeus-' + Math.floor(Math.random() * 90000) + 10000;

  const signature_plaintext =
    shop_id + secret_key + cart_id + secret_key + amount + secret_key;

  const signature = createHash('md5')
    .update(signature_plaintext)
    .digest('hex');

  /*      put cart data      */

  const params = {
    TableName: process.env.CARTS_TABLE,
    Item: {
      order_id: cart_id,
      content: JSON.stringify(order),
    },
  };

  try {
    await dynamodb('put', params);
  } catch (e) {
    return new Error('Internal server error.');
  }

  /*      put newsletter data      */

  // if (newsletter) {
  //   const params = {
  //     TableName: process.env.EMAILS_TABLE,
  //     Item: {
  //       name,
  //       email,
  //       newsletter,
  //     },
  //   };

  //   try {
  //     await dynamodb('put', params);
  //   } catch {}
  // }

  return {
    shop_id,
    cart_id,
    amount: price,
    language,
    success_url,
    failure_url,
	cancel_url,
    signature,
  };
};
