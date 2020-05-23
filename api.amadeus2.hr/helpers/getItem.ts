import { ValidationError } from 'apollo-server-lambda'
import { dynamodb } from '../libs/dynamodb'

export const getItem = async (id: string) => {
  const params = {
    TableName: process.env.ITEMS_TABLE,
    Key: {
      id,
    },
  }

  try {
    const result = await dynamodb('get', params)
    return result.Item || new ValidationError('Item not found.')
  } catch {
    return new Error('Internal server error.')
  }
}
