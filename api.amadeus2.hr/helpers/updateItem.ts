import { dynamodb } from '../libs/dynamodb';

export const updateItem = async item => {
  const {
    id,
    name,
    price,
    discountedPrice,
    description,
    availability,
    quantity,
    slug,
    images,
    type,
    brand,
  } = item;

  const params = {
    TableName: process.env.ITEMS_TABLE,
    Key: {
      id,
    },
    UpdateExpression:
      'set #name = :name, #price = :price, #discountedPrice = :discountedPrice, #description = :description, #availability = :availability, #quantity = :quantity, #slug = :slug, #images = :images, #type = :type, #brand = :brand',
    ExpressionAttributeNames: {
      '#name': 'name',
      '#price': 'price',
      '#discountedPrice': 'discountedPrice',
      '#description': 'description',
      '#availability': 'availability',
      '#quantity': 'quantity',
      '#slug': 'slug',
      '#images': 'images',
      '#type': 'type',
      '#brand': 'brand',
    },
    ExpressionAttributeValues: {
      ':name': name,
      ':price': price,
      ':discountedPrice': discountedPrice,
      ':description': description,
      ':availability': availability,
      ':quantity': quantity,
      ':slug': slug,
      ':images': images,
      ':type': type,
      ':brand': brand,
    },
    ReturnValues: 'ALL_NEW',
  };

  try {
    const result = await dynamodb('update', params);
    return result.Attributes;
  } catch (e) {
    return new Error('Internal server error.');
  }
};
