const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    phone: String!
    role: String!
    createdAt: String
    updatedAt: String
  }

  type Ride {
    id: ID!
    user: User!
    driver: Driver
    origin: String!
    destination: String!
    status: String!
    fare: Float
    createdAt: String
    updatedAt: String
  }

  type Driver {
    id: ID!
    name: String!
    email: String!
    phone: String!
    vehicleNumber: String
    status: String
    createdAt: String
    updatedAt: String
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    me: User
    users: [User]
    rides: [Ride]
    ride(id: ID!): Ride
  }

  type Mutation {
    register(name: String!, email: String!, phone: String!, password: String!): AuthPayload
    login(email: String!, password: String!): AuthPayload
    requestRide(origin: String!, destination: String!): Ride
    cancelRide(rideId: ID!): Ride
    updateProfile(name: String, phone: String): User
  }
`;

module.exports = typeDefs; 