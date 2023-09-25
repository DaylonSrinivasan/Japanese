import {read} from '../../../lib/neo4j';
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(res: NextApiResponse) {
    const result = await read(`
        MATCH (v:Vocabulary)
        WITH v, RAND() AS r
        ORDER BY r
        LIMIT 1
        RETURN v AS vocabulary;
    `);

    res.status(200).json({
        "japanese": result[0].vocabulary.properties.japanese,
        "hiragana": result[0].vocabulary.properties.hiragana,
        "english": result[0].vocabulary.properties.english,
    });
}