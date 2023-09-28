import React, { useState, useEffect } from 'react';
import { ADJECTIVE_CONJUGATIONS } from '../data/adjective_conjugations.js';
import '../styles/conjugation_quiz.css'; // Import your CSS file

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
    const sourceArray = selectedRowsEmpty ? ADJECTIVE_CONJUGATIONS : selectedRows.map((index) => ADJECTIVE_CONJUGATIONS[index]);
    
    const randomAdjectiveIndex = Math.floor(Math.random() * sourceArray.length);
    const adjective = sourceArray[randomAdjectiveIndex];
    const conjugations = Object.keys(adjective); // Access the properties correctly
    const randomConjugationIndex = Math.floor(Math.random() * conjugations.length);
    const conjugationToQuiz = conjugations[randomConjugationIndex];
    console.log('daylon debug ' + conjugationToQuiz);
  
    const japaneseSentenceWithoutConjugation = adjective[conjugationToQuiz].sentence.japanese.replace(adjective[conjugationToQuiz].conjugation, '____');
  
    return {
      adjective: adjective.adjective.conjugation,
      conjugationToQuiz,
      correctAnswer: adjective[conjugationToQuiz].conjugation,
      japaneseSentence: japaneseSentenceWithoutConjugation.trim(),
      englishSentence: adjective[conjugationToQuiz].sentence.english,
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
      <h1 className="app-title">Adjective Conjugation Quiz</h1>

      {quizData && (
        <div className="quiz-container">
          <h2>Quiz</h2>
          <p><strong>Adjective:</strong> {quizData.adjective}</p>
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

      <h2 className="table-title">Adjective Conjugations Table</h2>
      <table className="conjugation-table">
        <thead>
          <tr>
            <th>Adjective</th>
            <th>Polite</th>
            <th>Negative</th>
            <th>Polite Negative</th>
            <th>Past</th>
            <th>Past Polite</th>
            <th>Past Negative</th>
            <th>Past Polite Negative</th>
          </tr>
        </thead>
        <tbody>
          {ADJECTIVE_CONJUGATIONS.map((adjective, index) => (
            <tr
              key={index}
              className={selectedRows.includes(index) ? 'selected-row' : ''}
              onClick={() => toggleRowSelection(index)}
            >
              <td>{adjective.adjective.conjugation}</td>
              <td>{adjective.polite.conjugation}</td>
              <td>{adjective.negative.conjugation}</td>
              <td>{adjective.polite_negative.conjugation}</td>
              <td>{adjective.past.conjugation}</td>
              <td>{adjective.past_polite.conjugation}</td>
              <td>{adjective.past_negative.conjugation}</td>
              <td>{adjective.past_polite_negative.conjugation}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;