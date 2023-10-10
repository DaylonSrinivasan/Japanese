import {
    gql,
    ApolloClient,
    InMemoryCache,
    HttpLink,
  } from "@apollo/client";

import Vocabulary from '../resources/vocabulary'
import { type } from "os";
  
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
    const vocabularies = vocabularyData.map((edge: any) => {
      const { english, hiragana, japanese } = edge.node;
      const { level, lastSeen } = edge;
      return new Vocabulary(japanese, hiragana, english, level, new Date(lastSeen));
    });

    console.log('Returning data', vocabularies);
    return vocabularies;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

export async function updateUserProgress(userName: string, vocabularies: Vocabulary[]): Promise<JSON> {
  console.log('Called updateUserProgress with userName ' + userName + ' vocabularies ' + vocabularies);
  try {
    const vocabUpdates = vocabularies.map((vocabulary) => {
      return {
        update: {
          edge: {
            level: vocabulary.level,
            lastSeen: vocabulary.lastSeen,
          },
        },
        where: {
          node: {
            japanese: vocabulary.japanese,
          },
        },
      };
    });

    const { data } = await client.mutate({
      mutation: UPDATE_USER_PROGRESS,
      variables: {
        userName,
        vocabularies: vocabUpdates,
      },
    });

    console.log('Returning data ' + data);
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
