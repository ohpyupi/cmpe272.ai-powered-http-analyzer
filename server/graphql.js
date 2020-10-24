const path = require('path');
const { ApolloServer } = require('apollo-server-express');
const { loadSchemaSync } = require('@graphql-tools/load');
const { GraphQLFileLoader } = require('@graphql-tools/graphql-file-loader');
const { addResolversToSchema } = require('@graphql-tools/schema');
const { resolvers } = require('./resolvers');

const schema = loadSchemaSync(path.join(__dirname, './schema/schema.graphql'), {
  loaders: [new GraphQLFileLoader()],
});

const apolloServer = new ApolloServer({
  schema: addResolversToSchema({ schema, resolvers }),
});

module.exports = {
  apolloServer,
};