import { ApolloServer, gql, AuthenticationError } from 'apollo-server-lambda';
import fetch from 'node-fetch';
const jwt = require('jsonwebtoken');
const jwkToPem = require('jwk-to-pem');
import { getItem } from './helpers/getItem';
import { getItems } from './helpers/getItems';
import { getFeaturedItems } from './helpers/getFeaturedItems';
import { getSignature } from './helpers/getSignature';
import { getBanners } from './helpers/getBanners';
import { getTypes } from './helpers/getTypes';
import { getExchangeRates } from './helpers/getExchangeRates';
import { addItem } from './helpers/addItem';
import { updateItem } from './helpers/updateItem';
import { deleteItem } from './helpers/deleteItem';
import { uploadImage } from './helpers/uploadImage';
import { uploadBanner } from './helpers/uploadBanner';
import { deleteBanner } from './helpers/deleteBanner';
import { sendMessage } from './helpers/sendMessage';
import { sendReceipt } from './helpers/sendReceipt';
import { contactForm } from './helpers/contactForm';
import { newsletterSubscribe } from './helpers/newsletterSubscribe';
import { updateFile } from './helpers/updateFile';

const typeDefs = gql`
  type Query {
    items: [Item!]
    item(id: ID!): Item
    featuredItems: [Item!]
    signature(input: SignatureParams!): Signature!
    banners: Banners!
    types: [Type!]
    exchangeRates: ExchangeRates!
    # listMessages: [Messsage!]!
  }

  type Mutation {
    add(input: NewItem!): Item!
    update(input: UpdatedItem!): Item!
    delete(id: ID!): ID!
    uploadImage(base64: String!, name: String): String!
    uploadBanner(
      base64: String!
      platform: String!
      link: MultiLangStringInput!
    ): String!
    deleteBanner(src: String!, platform: String!): String!
    sendMessage(email: String!, message: String!): String!
    sendReceipt(email: String!, message: String!): String!
    contactForm(email: String!, content: String!): String!
    newsletterSubscribe(email: String!): String!
    updateAvailability(json: String!): String!
    updateTypes(json: String!): String!
    updateBrands(json: String!): String!
    updateFeaturedItems(json: String!): String!
  }

  # type Message {
  #   email: String!
  #   contents: String!
  # }

  type Item {
    id: ID!
    name: MultiLangString!
    price: Int!
    discountedPrice: Int!
    description: MultiLangString!
    availability: MultiLangString!
    quantity: Int!
    slug: String!
    images: [Image!]!
    type: MultiLangString!
    brand: String!
  }

  input NewItem {
    name: MultiLangStringInput!
    price: Int!
    discountedPrice: Int!
    description: MultiLangStringInput!
    availability: MultiLangStringInput!
    quantity: Int!
    slug: String!
    images: [ImageInput!]!
    type: MultiLangStringInput!
    brand: String!
  }

  input UpdatedItem {
    id: ID!
    name: MultiLangStringInput!
    price: Int!
    discountedPrice: Int!
    description: MultiLangStringInput!
    availability: MultiLangStringInput!
    quantity: Int!
    slug: String!
    images: [ImageInput!]!
    type: MultiLangStringInput!
    brand: String!
  }

  type MultiLangString {
    hr: String!
    en: String!
  }

  input MultiLangStringInput {
    hr: String!
    en: String!
  }

  type Image {
    src: String!
    index: Int!
  }

  input ImageInput {
    src: String!
    index: Int!
  }

  type Signature {
    shop_id: String!
    cart_id: String!
    amount: String!
    language: String!
    success_url: String!
    failure_url: String!
    cancel_url: String!
    signature: String!
  }

  input SignatureParams {
    order: [String!]!
    language: String!
  }

  type Banners {
    desktop: [Banner!]!
    mobile: [Banner!]!
  }

  type Banner {
    link: MultiLangString!
    src: String!
  }

  type Type {
    name: String!
    src: String!
  }

  type ExchangeRates {
    HRK: Float!
    EUR: Float!
    BAM: Float!
    RSD: Float!
    USD: Float!
    GBP: Float!
  }
`;

const resolvers = {
  Query: {
    items: () => getItems(),
    item: (_, { id }) => getItem(id),
    featuredItems: () => getFeaturedItems(),
    signature: (_, { input }) => getSignature(input),
    banners: () => getBanners(),
    types: () => getTypes(),
    exchangeRates: () => getExchangeRates(),
  },
  Mutation: {
    add: (_, { input }, { user, admin }) => {
      if (!user) throw new AuthenticationError('you must be logged in');
      if (!admin) throw new AuthenticationError('you must have admin access');

      return addItem(input);
    },

    update: (_, { input }, { user, admin }) => {
      if (!user) throw new AuthenticationError('you must be logged in');
      if (!admin) throw new AuthenticationError('you must have admin access');

      return updateItem(input);
    },

    delete: (_, { id }, { user, admin }) => {
      if (!user) throw new AuthenticationError('you must be logged in');
      if (!admin) throw new AuthenticationError('you must have admin access');

      return deleteItem(id);
    },

    uploadImage: (_, { base64, name }, { user, admin }) => {
      if (!user) throw new AuthenticationError('you must be logged in');
      if (!admin) throw new AuthenticationError('you must have admin access');

      return uploadImage(base64, name);
    },
    uploadBanner: (_, { base64, platform, link }, { user, admin }) => {
      if (!user) throw new AuthenticationError('you must be logged in');
      if (!admin) throw new AuthenticationError('you must have admin access');

      return uploadBanner(base64, platform, link);
    },
    deleteBanner: (_, { src, platform }, { user, admin }) => {
      if (!user) throw new AuthenticationError('you must be logged in');
      if (!admin) throw new AuthenticationError('you must have admin access');

      return deleteBanner(src, platform);
    },

    sendMessage: (_, { email, message }) => sendMessage(email, message),
    sendReceipt: (_, { email, message }) => sendReceipt(email, message),
    contactForm: (_, { email, content }) => contactForm(email, content),
    newsletterSubscribe: (_, { email }) => newsletterSubscribe(email),
    updateAvailability: (_, { json }, { user, admin }) => {
      if (!user) throw new AuthenticationError('you must be logged in');
      if (!admin) throw new AuthenticationError('you must have admin access');

      return updateFile('availability', json);
    },
    updateTypes: (_, { json }, { user, admin }) => {
      if (!user) throw new AuthenticationError('you must be logged in');
      if (!admin) throw new AuthenticationError('you must have admin access');

      return updateFile('types', json);
    },
    updateBrands: (_, { json }, { user, admin }) => {
      if (!user) throw new AuthenticationError('you must be logged in');
      if (!admin) throw new AuthenticationError('you must have admin access');

      return updateFile('brands', json);
    },
    updateFeaturedItems: (_, { json }, { user, admin }) => {
      if (!user) throw new AuthenticationError('you must be logged in');
      if (!admin) throw new AuthenticationError('you must have admin access');

      return updateFile('featured', json);
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: {
    endpoint: '/',
  },
  context: ({ event }) => {
    if (event.headers && event.headers.Authorization) {
      const token = event.headers.Authorization.replace('Bearer ', '') || '';

      const jwk = JSON.parse(process.env.COGNITO_JWK_DASHBOARD);
      const pem = jwkToPem(jwk);
      const user = jwt.verify(token, pem, { algorithms: ['RS256'] });
      const { exp, aud, iss, token_use } = user;

      if (
        exp < +new Date() &&
        aud === process.env.COGNITO_AUD_DASHBOARD &&
        iss === process.env.COGNITO_ISS_DASHBOARD &&
        token_use === 'id'
      ) {
        return { user, admin: true };
      }
    }

    return { user: null };
  },
});

exports.graphql = server.createHandler({
  cors: {
    origin: true,
    credentials: true,
  },
});
