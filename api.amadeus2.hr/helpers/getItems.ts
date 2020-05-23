import { dynamodb } from '../libs/dynamodb'

export const getItems = async () => {
  const params = {
    TableName: process.env.ITEMS_TABLE,
  }

  try {
    const result = await dynamodb('scan', params)
    return result.Items
  } catch (err) {
    return new Error('Internal server error.')
  }
}
