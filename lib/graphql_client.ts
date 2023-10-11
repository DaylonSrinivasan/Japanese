import {
    gql,
    ApolloClient,
    InMemoryCache,
    HttpLink,
  } from "@apollo/client";

import Translation from '../resources/translation'
  
const client = new ApolloClient({
    link: new HttpLink({ uri: '/api/graphql' }),
    cache: new InMemoryCache(),
  });

const FETCH_USER_PROGRESS = gql`
  query FetchUserProgress($userName: String!) {
    users(where: { name: $userName }) {
      translationConnection {
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
  $translations: [UserTranslationUpdateFieldInput!]!
) {
  updateUsers(
    where: { name: $userName }
    update: {
      translation: $translations
    }
  ) {
    users {
      name
    }
  }
}
`

export async function fetchUserProgress(userName: string): Promise<Translation[]> {
  console.log('Called fetchUserProgress with userName ' + userName);
  try {
    const { data } = await client.query({
      query: FETCH_USER_PROGRESS,
      variables: { userName },
    });
    
    const translationData = data.users[0]?.translationConnection.edges || [];
    const translations = translationData.map((edge: any) => {
      const { english, hiragana, japanese } = edge.node;
      const { level, lastSeen } = edge;
      return new Translation(japanese, hiragana, english, level, new Date(lastSeen));
    });

    console.log('Returning data', translations);
    return translations;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

export async function updateUserProgress(userName: string, translations: Translation[]): Promise<JSON> {
  console.log('Called updateUserProgress with userName ' + userName + ' translations ' + translations);
  try {
    const vocabUpdates = translations.map((translation) => {
      return {
        update: {
          edge: {
            level: translation.level,
            lastSeen: translation.lastSeen,
          },
        },
        where: {
          node: {
            japanese: translation.japanese,
          },
        },
      };
    });

    const { data } = await client.mutate({
      mutation: UPDATE_USER_PROGRESS,
      variables: {
        userName,
        translations: vocabUpdates,
      },
    });

    console.log('Returning data ' + data);
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
