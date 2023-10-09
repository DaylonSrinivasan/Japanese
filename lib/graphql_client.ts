import {
    gql,
    ApolloClient,
    InMemoryCache,
    HttpLink,
  } from "@apollo/client";

import Vocabulary from '../resources/vocabulary'
  
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

const UPDATE_USER_PROGRESS = gql`
mutation UpdateUserProgress(
  $userName: String!,
  $vocabularies: [UserVocabularyUpdateFieldInput!]!
) {
  updateUsers(
    where: { name: $userName }
    update: {
      vocabulary: $vocabularies
    }
  ) {
    users {
      name
    }
  }
}
`

export async function fetchUserProgress(userName: string): Promise<Vocabulary[]> {
  console.log('Called fetchUserProgress with userName ' + userName);
  try {
    const { data } = await client.query({
      query: FETCH_USER_PROGRESS,
      variables: { userName },
    });
    
    const vocabularyData = data.users[0]?.vocabularyConnection.edges || [];
    
    const vocabularies = vocabularyData.map((edge) => {
      const { english, hiragana, japanese } = edge.node;
      const { level, lastSeen } = edge;
      return new Vocabulary(japanese, hiragana, english, level, lastSeen);
    });

    console.log('Returning data', vocabularies);
    return vocabularies;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}