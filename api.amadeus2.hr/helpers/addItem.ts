import { dynamodb } from '../libs/dynamodb';
const uuidv4 = require('uuid/v4');

export const addItem = async item => {
  const id = uuidv4();
  const Item = {
    ...item,
    id,
  };

  const params = {
    TableName: process.env.ITEMS_TABLE,
    Item,
  };

  try {
    await dynamodb('put', params);
    return Item;
  } catch {
    return new Error('Internal server error.');
  }
};
