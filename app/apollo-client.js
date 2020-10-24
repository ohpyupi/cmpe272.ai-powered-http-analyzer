import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
} from '@apollo/client';

export const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: createHttpLink({ uri: '/graphql' }),
});