// Code taken from: https://dev.to/adamcowley/using-neo4j-in-your-next-nextjs-project-77

import neo4j from 'neo4j-driver'

const {NEO4J_URI, NEO4J_USERNAME, NEO4J_PASSWORD } = process.env

const driver = neo4j.driver(
    NEO4J_URI,
    neo4j.auth.basic(
      NEO4J_USERNAME,
      NEO4J_PASSWORD
    )
  )

export async function read(cypher, params = {}) {
  // 1. Open a session
  const session = driver.session()

  try {
    // 2. Execute a Cypher Statement
    const res = await session.executeRead(tx => tx.run(cypher, params))

    // 3. Process the Results
    const values = res.records.map(record => record.toObject())
    console.log('retrieved values ' + values);
    return values
  }
  finally {
    // 4. Close the session 
    await session.close()
  }
}

export async function write(cypher, params = {}) {
  // 1. Open a session
  const session = driver.session()

  try {
    // 2. Execute a Cypher Statement
    const res = await session.executeWrite(tx => tx.run(cypher, params))

    // 3. Process the Results
    const values = res.records.map(record => record.toObject())

    return values
  }
  finally {
    // 4. Close the session 
    await session.close()
  }
}