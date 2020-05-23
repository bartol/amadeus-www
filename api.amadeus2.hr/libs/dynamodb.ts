import * as AWS from 'aws-sdk'

interface Params {
  TableName: string | undefined
  Key?: {
    id: string
  }
}

export const dynamodb = (action: string, params: Params) => {
  const docClient = new AWS.DynamoDB.DocumentClient()

  return docClient[action](params).promise()
}
