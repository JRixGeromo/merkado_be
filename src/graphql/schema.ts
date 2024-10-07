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
    users: [User!] @cacheControl(maxAge: 60)  # Cache users query for 60 seconds
    products: [Product!] @cacheControl(maxAge: 120)  # Cache products query for 120 seconds
  }
`;
