// https://www.smashingmagazine.com/2023/03/full-stack-graphql-nextjs-neo4j-auradb-vercel/#client-side-data-fetching-with-apollo-client-in-next-js
import {
    ApolloProvider,
    ApolloClient,
    InMemoryCache,
    HttpLink,
  } from "@apollo/client";
  
  const createApolloClient = () => {
    const link = new HttpLink({
      uri: "/api/graphql",
    });
  
    return new ApolloClient({
      link,
      cache: new InMemoryCache(),
    });
  };
  
  export default function App({ Component, pageProps }) {
    return (
      <ApolloProvider client={createApolloClient()}>
        <Component {...pageProps} />
      </ApolloProvider>
    );
  }