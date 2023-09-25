import {read, write} from '../../../lib/neo4j';
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const japanese = req.query.japanese;
    console.log(japanese);
    const result = await read(`
        MATCH(v:Vocabulary {japanese: $japanese})
        RETURN v AS vocabulary
    `, {japanese: japanese});

    res.status(200).json({
        "japanese": result[0].vocabulary.properties.japanese,
        "hiragana": result[0].vocabulary.properties.hiragana,
        "english": result[0].vocabulary.properties.english,
    });
}