import React, { useState, useEffect } from 'react';
import { VERB_CONJUGATIONS } from '../data/verb_conjugations.js';
import '../styles/verb_conjugation.css'; // Import your CSS file

function App() {
  const [quizData, setQuizData] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [enterPressCount, setEnterPressCount] = useState(0);
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    setQuizData(getRandomQuizData());
    setUserAnswer('');
    setFeedback('');
    setEnterPressCount(0);
  }, []);

  const getRandomQuizData = () => {
    const selectedRowsEmpty = selectedRows.length === 0;
    const sourceArray = selectedRowsEmpty ? VERB_CONJUGATIONS : selectedRows.map((index) => VERB_CONJUGATIONS[index]);
    
    const randomVerbIndex = Math.floor(Math.random() * sourceArray.length);
    const verb = sourceArray[randomVerbIndex];
    const conjugations = Object.keys(verb).filter((key) => key !== 'dictionary');
    const randomConjugationIndex = Math.floor(Math.random() * conjugations.length);
    const conjugationToQuiz = conjugations[randomConjugationIndex];
  
    const japaneseSentenceWithoutConjugation = verb[conjugationToQuiz].sentence.japanese.replace(verb[conjugationToQuiz].conjugation, '____');
  
    return {
      verb: verb.dictionary,
      conjugationToQuiz,
      correctAnswer: verb[conjugationToQuiz].conjugation,
      japaneseSentence: japaneseSentenceWithoutConjugation.trim(),
      englishSentence: verb[conjugationToQuiz].sentence.english,
    };
  };
  
  

  const handleKeyUp = (e) => {
    if (e.key === 'Enter') {
      setEnterPressCount(enterPressCount + 1);
  
      if (enterPressCount % 2 === 0) {
        // Even number of Enter presses, check if the answer is correct
        const isCorrect = userAnswer === quizData.correctAnswer;
  
        if (isCorrect) {
          setFeedback(
            <p className="correct-feedback">Correct! Press Enter for a new quiz.</p>
          );
        } else {
          setFeedback(
            <p className="incorrect-feedback">
              Incorrect. The correct answer is:
              <span className="correct-answer">{quizData.correctAnswer}</span>. Press Enter for a new quiz.
            </p>
          );
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

  const toggleRowSelection = (index) => {
    console.log('selecting row ' + index);
    // Find the index of the clicked row in the selectedRows array
    const selectedIndex = selectedRows.indexOf(index);

    if (selectedIndex === -1) {
      // If the row is not already selected, add it to the selectedRows array
      setSelectedRows([...selectedRows, index]);
    } else {
      // If the row is already selected, remove it from the selectedRows array
      setSelectedRows(selectedRows.filter((rowIndex) => rowIndex !== index));
    }
  };

  return (
    <div className="app-container">
      <h1 className="app-title">Verb Conjugation Quiz</h1>

      {quizData && (
        <div className="quiz-container">
          <h2>Quiz</h2>
          <p><strong>Verb:</strong> {quizData.verb}</p>
          <p><strong>Conjugation:</strong> {quizData.conjugationToQuiz}</p>
          <p><strong>Example:</strong> {quizData.englishSentence}</p>
          <p><strong>Translation:</strong> {quizData.japaneseSentence}</p>
          <label>Your answer: </label>
          <input
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            onKeyUp={handleKeyUp}
          />
          <div className="feedback-container">
            {feedback && (
              <div className={feedback === 'Correct! Press Enter for a new quiz.' ? 'correct-feedback' : 'incorrect-feedback'}>
                {feedback}
              </div>
            )}
          </div>
        </div>
      )}

      <h2 className="table-title">Verb Conjugations Table</h2>
      <table className="verb-table">
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
            <tr
              key={index}
              className={selectedRows.includes(index) ? 'selected-row' : ''}
              onClick={() => toggleRowSelection(index)}
            >
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