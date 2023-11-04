const neo4j = require("neo4j-driver");
const { createYoga } = require("graphql-yoga");
const { Neo4jGraphQL } = require("@neo4j/graphql");

// Read our Neo4j connection credentials from environment variables (see .env.local)
const { NEO4J_URI, NEO4J_USERNAME, NEO4J_PASSWORD } = process.env;

const typeDefs = /* GraphQL */ `
  type User {
    id: ID!
    name: String!
    translation: [Translation!]! @relationship(type: "STUDIES", direction: OUT, properties: "StudiesProperties")
  }

  type Translation {
    id: ID!
    japanese: String!
    hiragana: String!
    english: String!
    buildsUpon: [Translation!]! @relationship(type: "BUILDS_UPON", direction: OUT)
  }

  interface StudiesProperties @relationshipProperties {
    targetCharacterSet: String!
    level: Int!
    lastSeen: DateTime!
  }
`;

// Create a Neo4j driver instance to connect to Neo4j AuraDB
const driver = neo4j.driver(
  NEO4J_URI,
  neo4j.auth.basic(NEO4J_USERNAME, NEO4J_PASSWORD)
);

// Type definitions and a Neo4j driver instance are all that's required for
// building a GraphQL API with the Neo4j GraphQL Library - no resolvers!
const neoSchema = new Neo4jGraphQL({
  typeDefs,
  driver,
});

// Building the Neo4j GraphQL schema is an async process
const initServer = async () => {
  console.log("Building GraphQL server");
  return await neoSchema.getSchema();
};

// Note the use of the top-level await here in the call to initServer()
export default createYoga({
  schema: await initServer(),
  graphqlEndpoint: "/api/graphql",
});