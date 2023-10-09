import {
    gql,
    ApolloClient,
    InMemoryCache,
    HttpLink,
  } from "@apollo/client";
  
const client = new ApolloClient({
    link: new HttpLink({ uri: '/api/graphql' }),
    cache: new InMemoryCache(),
  });

const FETCH_USER_PROGRESS = gql`
  query FetchUserProgress($userName: String!) {
    users(where: { name: $userName }) {
      vocabularyConnection {
        edges {
          level
          lastSeen
          node {
            english
            hiragana
            japanese
          }
        }
      }
    }
  }
`;

export async function fetchUserProgress(userName: string) : Promise<JSON> {
    console.log('Called fetchUserProgress with userName ' + userName);
    try {
      const { data } = await client.query({
        query: FETCH_USER_PROGRESS,
        variables: { userName },
      });
      console.log('Returning data ' + data);
      return data;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }