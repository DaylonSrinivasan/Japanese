import type { NextApiRequest, NextApiResponse } from 'next'

type MyTuple = [string, string, string];

const questions: MyTuple[] = [
    ["あなたの名前は何ですか？", "What is your name?", "id 1"],
    ["何歳ですか？", "How old are you?", "id 2"],
    ["あなたの好きな色は何ですか？", "What is your favorite color?", "id 3"]
  ];

function getRandomTuple(): MyTuple {
  const randomIndex = Math.floor(Math.random() * questions.length);
  return questions[randomIndex];
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const tuple = getRandomTuple();
      
    res.status(200).json({ "japanese": tuple[0], "hint": tuple[1], "question_id": tuple[2]});
}