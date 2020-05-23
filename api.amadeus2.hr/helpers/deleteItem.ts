import { dynamodb } from '../libs/dynamodb';

export const deleteItem = async id => {
  const params = {
    TableName: process.env.ITEMS_TABLE,
    Key: {
      id,
    },
    ReturnValues: 'ALL_OLD',
  };

  try {
    const result = await dynamodb('delete', params);
    if (!result.Attributes) {
      return new Error("Item doesn't exist.");
    }
    return id;
  } catch {
    return new Error('Internal server error.');
  }
};
