import {
    gql,
    ApolloClient,
    InMemoryCache,
    HttpLink,
  } from "@apollo/client";

import Translation from '../resources/translation'

import { LEVEL_DELAYS } from './srs'
  
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
          id
          english
          hiragana
          japanese
          buildsUpon {
            id
          }
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
    const oneHour = 60 * 60 * 1000;
    const now = new Date();

    // TODO(daylon) - this filter removes all items not appearing in the next hour.
    // That breaks the "/progress" page, since it won't show things that it should.
    const translationData = (data.users[0]?.translationConnection.edges || [])
    .filter((edge: any) => now.getTime() + oneHour >= new Date(edge.lastSeen).getTime() + LEVEL_DELAYS[edge.level]);

    const translationsMap = new Map();

    translationData.forEach((edge: any) => {
      const { english, hiragana, japanese, id } = edge.node;
      const { level, lastSeen } = edge;

      const translation = new Translation(id, level, new Date(lastSeen), japanese, hiragana, english);
      translationsMap.set(id, translation);
    });

    translationData.forEach((edge: any) => {
      const translation = translationsMap.get(edge.node.id);
      edge.node.buildsUpon.forEach((reqTranslation: any) => {
        const reqId = reqTranslation['id'];
        if (translationsMap.has(reqId)) {
          translation.addRequirement(translationsMap.get(reqId));
        }
      })
    });

    // Convert the map of Translation objects to an array
    const translations = Array.from(translationsMap.values());

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
