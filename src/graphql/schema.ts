// src/graphql/schema.ts
import { gql } from 'graphql-tag';

export const typeDefs = gql`
  type User {
    id: ID!
    email: String!
    vendorProfile: VendorProfile
  }

  type VendorProfile {
    id: ID!
    location: String
    user: User!
  }

  type Product {
    id: ID!
    name: String!
    price: Float!
    vendor: VendorProfile!
  }

  type Query {
    users: [User!]
    products: [Product!]
  }
`;
