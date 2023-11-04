// TranslationQuiz.js
import React, { useState, useEffect } from 'react';
import { fetchUserProgress, updateUserProgress } from '../lib/graphql_client';
import { LEVEL_DELAYS, SRS } from '../lib/srs';
import { getSimilarity, EQUIVALENT, SIMILAR } from '../lib/levelstein';
import '../styles/translation_quiz.css';
import { toKana } from 'wanakana';

const USERNAME = 'daylon';
const FEEDBACK_CORRECT = 'Correct!'
const FEEDBACK_SIMILAR = 'Similar!'
const FEEDBACK_INCORRECT = 'Incorrect!'
const QUESTION_PHASE = 'QuestionPhase'
const FEEDBACK_PHASE = 'FeedbackPhase'

function TranslationQuiz() {
  const [currentTranslation, setCurrentTranslation] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [hiraganaInput, setHiraganaInput] = useState(''); // Store the converted hiragana input
  const [feedback, setFeedback] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [srs, setSRS] = useState(null);
  const [quizPhase, setQuizPhase] = useState(QUESTION_PHASE); // Either QUESTION_PHASE or FEEDBACK_PHASE

  useEffect(() => {
    async function loadTranslations() {
      try {
        const fetchedTranslations = await fetchUserProgress(USERNAME);
        const oneHour = 60 * 60 * 1000;
        const now = new Date();
        const translationsToQuiz = fetchedTranslations.filter((translation) => now.getTime() + oneHour >= translation.lastSeen.getTime() + LEVEL_DELAYS[translation.level]);
        setSRS(new SRS(translationsToQuiz));
        setCurrentTranslation(srs.getNext());
        setQuizPhase(QUESTION_PHASE); // Start with question phase.
      } catch (error) {
        console.error('Error fetching translations', error);
      }
    }
    loadTranslations();
  }, []);

  useEffect(() => {
    if (srs !== null) {
      setCurrentTranslation(srs.getNext());
      setQuizPhase(QUESTION_PHASE);
    }
  }, [srs]);

  const handleInputChange = (event) => {
    const input = event.target.value;
    setUserInput(input); // Keep track of the raw user input

    const convertedHiragana = toKana(input, { IMEMode: 'Romaji' });
    setHiraganaInput(convertedHiragana);
  };

  const handleEnterKey = (event) => {
    if (event.key === 'Enter') {
      if (quizPhase === QUESTION_PHASE) {
        checkAnswer();
      }
      else {
        nextQuestion();
      }
    }
  };

  const checkAnswer = () => {
    if (!currentTranslation) return;
    const { targetCharacterSet, japanese, hiragana, english } = currentTranslation;

    let feedback = FEEDBACK_INCORRECT;
    let correctAnswer = '';
    if (targetCharacterSet === 'japanese') {
      feedback = (userInput === japanese || hiraganaInput === hiragana) ? FEEDBACK_CORRECT : FEEDBACK_INCORRECT;
      correctAnswer = `Japanese: ${japanese}. Hiragana: ${hiragana}`;
    }
    if (targetCharacterSet === 'hiragana') {
      feedback = hiraganaInput === hiragana ? FEEDBACK_CORRECT : FEEDBACK_INCORRECT;
      correctAnswer = `Hiragana: ${hiragana}`;
    }
    if (targetCharacterSet === 'english') {
      const similarity = getSimilarity(userInput, english);
      feedback = similarity === EQUIVALENT ? FEEDBACK_CORRECT : similarity === SIMILAR ? FEEDBACK_SIMILAR : FEEDBACK_INCORRECT;
      correctAnswer = `English: ${english}`;
    }
    setFeedback(feedback);
    setCorrectAnswer(correctAnswer);
    setQuizPhase(FEEDBACK_PHASE);
  };

  const nextQuestion = () => {
    srs.processFeedback(currentTranslation, feedback === FEEDBACK_CORRECT || feedback === FEEDBACK_SIMILAR);
    handleSaveProgress(currentTranslation);
    setCurrentTranslation(srs.getNext());
    setFeedback('');
    setUserInput('');
    setHiraganaInput('');
    setCorrectAnswer('');
    setQuizPhase(QUESTION_PHASE); // Move to the next question phase
  };

  const handleSaveProgress = async (translation) => {
    try {
      await updateUserProgress(USERNAME, [translation]);
    } catch (error) {
      console.error('Error saving progress', error);
      setFeedback('Error saving progress');
    }
  };

  return (
    <div className="translation-container">
      <div className="translation-header text-center">
        <h2>Translation Quiz</h2>
      </div>
      {currentTranslation && (
        <div className="translation-card">
          <p>{currentTranslation.targetCharacterSet === 'japanese' ? 'English' : 'Japanese'}: {currentTranslation.targetCharacterSet === 'japanese' ? currentTranslation.english : currentTranslation.japanese}</p>
          <p>What is the {currentTranslation.targetCharacterSet}?</p>
          <input
            type="text"
            value={currentTranslation.targetCharacterSet === 'hiragana' || currentTranslation.targetCharacterSet === 'japanese' ? hiraganaInput : userInput}
            onChange={handleInputChange}
            onKeyPress={handleEnterKey}
            className="translation-input"
          />
          <p
            className={`translation-feedback ${
              feedback === FEEDBACK_CORRECT || feedback === FEEDBACK_SIMILAR
                ? 'correct-answer'
                : feedback === FEEDBACK_INCORRECT
                ? 'incorrect-feedback'
                : ''
            }`}
          >
            {feedback}
          </p>
          {(feedback === FEEDBACK_INCORRECT || feedback === FEEDBACK_SIMILAR) && (
            <p className="correct-answer">{correctAnswer}</p>
          )}
          <p>Level: {currentTranslation.level}</p>
          <p>Last Seen: {currentTranslation.lastSeen.toLocaleString()}</p>
        </div>
      )}
    </div>
  );
  
}

export default TranslationQuiz;
