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
    users: [User!]  # Query to fetch all users
    products: [Product!]  # Query to fetch all products
    productById(id: ID!): Product  # Query to fetch product by ID
  }

  type Mutation {
    createProduct(name: String!, price: Float!, categoryId: Int!, vendorId: Int!, unitId: Int!): Product
    updateProduct(id: Int!, name: String, price: Float): Product
    deleteProduct(id: Int!): Boolean
  }
`;
