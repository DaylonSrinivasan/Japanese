import type { NextApiRequest, NextApiResponse } from 'next'

function getRandomBoolean(): boolean {
    return Math.random() < 0.5; // Returns true or false with equal probability
  }

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const randomValue = getRandomBoolean();
    res.status(200).json({ "result": randomValue, "expected_answer": randomValue ? '' : 'Expected Answer Text'});
}