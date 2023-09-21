import React, { useState, useEffect } from 'react';
import { VERB_CONJUGATIONS } from '../data/verb_conjugations.js';

function App() {
  const [quizData, setQuizData] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [enterPressCount, setEnterPressCount] = useState(0);

  useEffect(() => {
    setQuizData(getRandomQuizData());
    setUserAnswer('');
    setFeedback('');
    setEnterPressCount(0);
  }, []);

  const getRandomQuizData = () => {
    // Select a random verb and a random conjugation to quiz the user.
    const randomVerbIndex = Math.floor(Math.random() * VERB_CONJUGATIONS.length);
    const verb = VERB_CONJUGATIONS[randomVerbIndex];

    const conjugations = Object.keys(verb).filter(
      (key) => key !== 'dictionary'
    );

    const randomConjugationIndex = Math.floor(
      Math.random() * conjugations.length
    );
    const conjugationToQuiz = conjugations[randomConjugationIndex];

    // Remove the conjugation from the Japanese sentence
    const japaneseSentenceWithoutConjugation = verb[conjugationToQuiz].sentence.japanese.replace(verb[conjugationToQuiz].conjugation, '____');

    return {
      verb: verb.dictionary,
      conjugationToQuiz,
      correctAnswer: verb[conjugationToQuiz].conjugation,
      japaneseSentence: japaneseSentenceWithoutConjugation.trim(), // Trim any leading/trailing spaces
      englishSentence: verb[conjugationToQuiz].sentence.english,
    };
  };

  const handleKeyUp = (e) => {
    if (e.key === 'Enter') {
      setEnterPressCount(enterPressCount + 1);

      if (enterPressCount % 2 === 0) {
        // Even number of Enter presses, show feedback
        if (userAnswer === quizData.correctAnswer) {
          setFeedback('Correct! Press Enter for a new quiz.');
        } else {
          setFeedback(`Incorrect. The correct answer is: ${quizData.correctAnswer}. Press Enter for a new quiz.`);
        }
      } else {
        // Odd number of Enter presses, start a new quiz
        startNewQuiz();
      }
    }
  };

  const startNewQuiz = () => {
    setQuizData(getRandomQuizData());
    setUserAnswer('');
    setFeedback('');
    setEnterPressCount(0);
  };

  return (
    <div>
      <h1>Verb Conjugation Quiz</h1>

      {/* Display the quiz */}
      {quizData && (
        <div>
          <h2>Quiz:</h2>
          <p>Verb: {quizData.verb}</p>
          <p>Japanese Sentence: {quizData.japaneseSentence}</p>
          <p>English Sentence: {quizData.englishSentence}</p>
          <label>Your Answer: </label>
          <input
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            onKeyUp={handleKeyUp}
          />
          <p>{feedback}</p>
        </div>
      )}

      {/* Display the table */}
      <h2>Verb Conjugations Table</h2>
      <table>
        <thead>
          <tr>
            <th>Verb</th>
            <th>Dictionary</th>
            <th>Negative</th>
            <th>Polite</th>
            <th>Polite Negative</th>
            <th>Past</th>
            <th>Past Negative</th>
            <th>Past Polite</th>
            <th>Past Polite Negative</th>
            <th>Te-form</th>
          </tr>
        </thead>
        <tbody>
          {VERB_CONJUGATIONS.map((verb, index) => (
            <tr key={index}>
              <td>{verb.dictionary}</td>
              <td>{verb.dictionary}</td>
              <td>{verb.negative.conjugation}</td>
              <td>{verb.polite.conjugation}</td>
              <td>{verb.polite_negative.conjugation}</td>
              <td>{verb.past.conjugation}</td>
              <td>{verb.past_negative.conjugation}</td>
              <td>{verb.past_polite.conjugation}</td>
              <td>{verb.past_polite_negative.conjugation}</td>
              <td>{verb.te.conjugation}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
