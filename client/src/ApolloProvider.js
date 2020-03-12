import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { WebSocketLink } from 'apollo-link-ws';
import { InMemoryCache } from 'apollo-cache-inmemory';

const wsSocket = new WebSocketLink({
  uri: `ws://localhost:4000/graphql`,
  options: {
    reconnect: true,
  },
});

const client = new ApolloClient({
  link: wsSocket,
  cache: new InMemoryCache(),
});

export default ({ children }) => (
  <ApolloProvider client={client}>{children}</ApolloProvider>
);
