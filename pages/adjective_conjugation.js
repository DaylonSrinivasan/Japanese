import React, { useState, useEffect } from 'react';
import {SRSItem, SRS} from '../lib/srs.ts';
import { ADJECTIVE_CONJUGATIONS } from '../data/adjective_conjugations.js';
import '../styles/conjugation_quiz.css';

class SRSElement extends SRSItem {
  constructor(index, conjugation) {
    super(0, 0, new Date());
    this.index = index;
    this.conjugation = conjugation;
  }

  toString() {
    return `SRSElement { index: ${this.index}, conjugation: ${this.conjugation}}`;
  }
}

function App() {
  const [quizData, setQuizData] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [enterPressCount, setEnterPressCount] = useState(0);
  const [srs, setSRS] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    const rowsToUse = selectedRows.length === 0 ? Array.from({ length: ADJECTIVE_CONJUGATIONS.length }, (_, i) => i) : selectedRows;
    const initialSRSData = [];
    
    for (const row of rowsToUse) {
      for (const conjugation of Object.keys(ADJECTIVE_CONJUGATIONS[row])) {
        initialSRSData.push(new SRSElement(row, conjugation));
      }
    }
    if (srs === null) {
      setSRS(new SRS(initialSRSData));
    } else {
      srs.items = initialSRSData;
      startNewQuiz();
    }
  }, [selectedRows]);

  useEffect(() => {
    if (srs !== null) {
      startNewQuiz();
    }
  }, [srs]);

  const getQuizData = (quizElement) => {
    const adjective = ADJECTIVE_CONJUGATIONS[quizElement.index];
    const conjugationToQuiz = adjective[quizElement.conjugation];
    const japaneseSentenceWithoutConjugation = conjugationToQuiz.sentence.japanese.replace(conjugationToQuiz.conjugation, '____');
  
    return {
      adjective: adjective.dictionary.conjugation,
      element: quizElement,
      conjugationToQuiz: quizElement.conjugation,
      correctAnswer: conjugationToQuiz.conjugation,
      japaneseSentence: japaneseSentenceWithoutConjugation.trim(),
      englishSentence: conjugationToQuiz.sentence.english,
    };
  };


  const handleKeyUp = (e) => {
    if (e.key === 'Enter') {
      setEnterPressCount(enterPressCount + 1);
  
      if (enterPressCount % 2 === 0) {
        const isCorrect = userAnswer === quizData.correctAnswer;

        if (isCorrect) {
          setFeedback(<p className="correct-feedback">Correct! Press Enter for a new quiz.</p>);
        } else {
          setFeedback(
            <p className="incorrect-feedback">
              Incorrect. The correct answer is:
              <span className="correct-answer">{quizData.correctAnswer}</span>. Press Enter for a new quiz.
            </p>
          );
        }
        srs.processFeedback(quizData.element, isCorrect);
      } else {
        startNewQuiz();
      }
    }
  };

  const startNewQuiz = () => {
    setQuizData(getQuizData(srs.getNext()));
    setUserAnswer('');
    setFeedback('');
    setEnterPressCount(0);
  };

  const toggleRowSelection = (index) => {
    const selectedIndex = selectedRows.indexOf(index);
    const updatedSelectedRows = [...selectedRows];

    if (selectedIndex === -1) {
      updatedSelectedRows.push(index);
    } else {
      updatedSelectedRows.splice(selectedIndex, 1);
    }

    setSelectedRows(updatedSelectedRows);
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
            {feedback}
          </div>
        </div>
      )}

      <h2 className="table-title">Adjective Conjugations Table</h2>
      <table className="conjugation-table">
        <thead>
          <tr>
            <th>Dictionary</th>
            <th>Polite</th>
            <th>Negative</th>
            <th>Polite Negative</th>
            <th>Past</th>
            <th>Past Polite</th>
            <th>Past Negative</th>
            <th>Past Polite Negative</th>
            <th>Te form</th>
          </tr>
        </thead>
        <tbody>
          {ADJECTIVE_CONJUGATIONS.map((adjective, index) => (
            <tr
              key={index}
              className={selectedRows.includes(index) ? 'selected-row' : ''}
              onClick={() => toggleRowSelection(index)}
            >
              {Object.keys(adjective).map((conjugation) => (
                <td key={conjugation}>{adjective[conjugation].conjugation}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
