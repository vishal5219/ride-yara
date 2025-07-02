const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    role: String!
  }
  type Query {
    me: User
    health: String!
  }
  type Mutation {
    register(username: String!, email: String!, password: String!): User
    login(email: String!, password: String!): String
  }
`;

module.exports = typeDefs; 