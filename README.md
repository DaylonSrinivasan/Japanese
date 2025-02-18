This is Daylon's Japanese studying app!

# User Notes

Visit the deployed version at:
1. https://japanese-studying.vercel.app/translation
2. https://japanese-studying.vercel.app/progress
3. https://japanese-studying.vercel.app/verb_conjugation
4. https://japanese-studying.vercel.app/adjective_conjugation


## Required set-up

1. create a .env file with neo4j credentials (see .env.example)

## Loading data into database from CSV

This is used to populate our study data (such as Japanese vocab).

1. Push CSV to github
2. Add vocab with:

```
LOAD CSV WITH HEADERS FROM 'https://raw.githubusercontent.com/DaylonSrinivasan/Japanese/main/data/vocabulary.csv' AS row
MERGE (v:Vocabulary:Translation {japanese: row.japanese})
ON CREATE SET v.hiragana = row.hiragana, v.english = row.english, v.id = apoc.create.uuid();
```

3. Add sentences with:

```
LOAD CSV WITH HEADERS FROM 'https://raw.githubusercontent.com/DaylonSrinivasan/Japanese/main/data/sentences.csv' AS row
MERGE (s:Sentence:Translation {japanese: row.japanese})
ON CREATE SET s.hiragana = row.hiragana, s.english = row.english, s.id = apoc.create.uuid()
WITH s, split(row.vocabularies, '|') as vocabList
UNWIND vocabList as vocab
MATCH (v:Vocabulary {japanese: vocab})
MERGE (s)-[:BUILDS_UPON]->(v);
```

4. Create connections between the user ("daylon") and newly added translations by entering:

```
MERGE (user:User {name: "daylon"})
WITH user
MATCH (translation:Translation)
WHERE NOT (user)-[:STUDIES {targetCharacterSet: "japanese"}]->(translation)
CREATE (user)-[r:STUDIES {targetCharacterSet: "japanese", level: 0, lastSeen: datetime()}]->(translation)
RETURN r;

MATCH (user:User {name: "daylon"})
MATCH (translation:Translation)
WHERE NOT (user)-[:STUDIES {targetCharacterSet: "hiragana"}]->(translation)
CREATE (user)-[r:STUDIES {targetCharacterSet: "hiragana", level: 0, lastSeen: datetime()}]->(translation)
RETURN r;

MATCH (user:User {name: "daylon"})
MATCH (translation:Translation)
WHERE NOT (user)-[:STUDIES {targetCharacterSet: "english"}]->(translation)
CREATE (user)-[r:STUDIES {targetCharacterSet: "english", level: 0, lastSeen: datetime()}]->(translation)
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

