import React, { useState, useEffect } from 'react';
import { SRSItem, SRS } from '../lib/srs.ts';
import { VERB_CONJUGATIONS } from '../data/verb_conjugations_hiragana.js';
import '../styles/conjugation_quiz.css';
import { toKana } from 'wanakana';


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

const USE_HIRAGANA = true;
const ALL_CONJUGATIONS = ["negative", "polite", "polite_negative", "past", "past_negative", "past_polite", "past_polite_negative", "te"]

function App() {
  const [quizData, setQuizData] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [userAnswerHiragana, setUserAnswerHiragana] = useState('');
  const [feedback, setFeedback] = useState('');
  const [enterPressCount, setEnterPressCount] = useState(0);
  const [srs, setSRS] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedConjugations, setSelectedConjugations] = useState([]);


  useEffect(() => {
    const rowsToUse = selectedRows.length === 0 ? Array.from({ length: VERB_CONJUGATIONS.length }, (_, i) => i) : selectedRows;
    const conjugationsToUse = selectedConjugations.length === 0 ? ALL_CONJUGATIONS : selectedConjugations;
    const initialSRSData = [];

    for (const row of rowsToUse) {
      for (const conjugation of conjugationsToUse) {
        initialSRSData.push(new SRSElement(row, conjugation));
      }
    }
    if (srs === null) {
      setSRS(new SRS(initialSRSData));
    } else {
      srs.items = initialSRSData;
      startNewQuiz();
    }
  }, [selectedRows, selectedConjugations]);

  useEffect(() => {
    if (srs !== null) {
      startNewQuiz();
    }
  }, [srs]);

  const getQuizData = (quizElement) => {
    const verb = VERB_CONJUGATIONS[quizElement.index];
    const conjugationToQuiz = verb[quizElement.conjugation];
    const japaneseSentenceWithoutConjugation = conjugationToQuiz.sentence.japanese.replace(conjugationToQuiz.conjugation, '____');

    return {
      verb: verb.dictionary,
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
        // Even number of Enter presses, check if the answer is correct
        const isCorrect = USE_HIRAGANA ? userAnswerHiragana === quizData.correctAnswer : userAnswer === quizData.correctAnswer;

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
    setUserAnswerHiragana('');
    setFeedback('');
    setEnterPressCount(0);
  };

  const toggleConjugationSelection = (conjugation) => {
    setSelectedConjugations(current => {
      const isAlreadySelected = current.includes(conjugation);
      if (isAlreadySelected) {
        return current.filter(item => item !== conjugation);
      } else {
        return [...current, conjugation];
      }
    });
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

  const handleInputChange = (event) => {
    const input = event.target.value;
    setUserAnswer(input);

    const convertedHiragana = toKana(input, { IMEMode: 'Romaji' });
    setUserAnswerHiragana(convertedHiragana);
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
            value={USE_HIRAGANA ? userAnswerHiragana : userAnswer}
            onChange={handleInputChange}
            onKeyUp={handleKeyUp}
          />
          <div className="feedback-container">
            {feedback}
          </div>
        </div>
      )}

      <h2 className="table-title">Verb Conjugations Table</h2>
      <table className="conjugation-table">
        <thead>
          <tr>
            <th>Dictionary</th>
            {ALL_CONJUGATIONS.map((conjugation) => (
              <th
                key={conjugation}
                className={selectedConjugations.includes(conjugation) ? 'selected-conjugation' : ''}
                onClick={() => toggleConjugationSelection(conjugation)}
              >
                {conjugation}
              </th>
            ))}
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