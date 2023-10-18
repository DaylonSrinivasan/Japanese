Daylon's Japanese studying app.

# User Notes

Visit the deployed version at: https://japanese-studying.vercel.app/translation

# Developer Notes

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Required set-up

1. create a .env file with neo4j credentials (see .env.example)

## Loading data into database from CSV

This is used to populate our study data (such as Japanese vocab).

1. Push CSV to github
2. Add vocab with:

```
LOAD CSV WITH HEADERS FROM 'https://raw.githubusercontent.com/DaylonSrinivasan/Japanese/main/data/vocabulary.csv/{token}' AS row
MERGE (v:Vocabulary:Translation {japanese: row.japanese})
ON CREATE SET v.hiragana = row.hiragana, v.english = row.english;
```

3. Add sentences with:

```
LOAD CSV WITH HEADERS FROM 'https://raw.githubusercontent.com/DaylonSrinivasan/Japanese/main/data/sentences.csv/{token}' AS row
MERGE (v:Sentence:Translation {japanese: row.japanese})
ON CREATE SET v.hiragana = row.hiragana, v.english = row.english;

// Assuming the vocabulary words are already loaded into the graph as Vocabulary nodes
MATCH (s:Sentence:Translation), (v:Vocabulary)
WHERE s.japanese =~ ".*" + v.japanese + ".*"
MERGE (s)-[:BUILDS_UPON]->(v);

```

4. Create connections between the user ("daylon") and newly added translations by entering:

```
MATCH (user:User {name: "daylon"})
MATCH (translation:Translation)
WHERE NOT (user)-[:STUDIES]->(translation)
CREATE (user)-[r:STUDIES {level: 0, lastSeen: datetime()}]->(translation)
RETURN r;
```


## Running locally

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## GraphQL

Query playground can be found at [http://localhost:3000/api/graphql](http://localhost:3000/api/graphql).

