// GraphQL Query resolvers
module.exports = {
  me: async (_, __, { user }) => user,
  health: () => 'OK',
}; 