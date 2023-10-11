// TranslationQuiz.js
import React, { useState, useEffect } from 'react';
import { fetchUserProgress, updateUserProgress } from '../lib/graphql_client';
import { SRS } from '../lib/srs';
import '../styles/translation_quiz.css';
import { toKana } from 'wanakana';

const USERNAME = 'daylon';

function TranslationQuiz() {
  const [currentTranslation, setCurrentTranslation] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [hiraganaInput, setHiraganaInput] = useState(''); // Store the converted hiragana input
  const [feedback, setFeedback] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [numCorrectAnswers, setNumCorrectAnswers] = useState(0);
  const [srs, setSRS] = useState(null);
  const [quizPhase, setQuizPhase] = useState(1); // 1: Hiragana, 2: Hiragana Feedback, 3: English, 4: English Feedback

  useEffect(() => {
    async function loadTranslations() {
      try {
        const fetchedTranslations = await fetchUserProgress(USERNAME);
        setSRS(new SRS(fetchedTranslations));
        setCurrentTranslation(srs.getNext());
        setQuizPhase(1); // Start with phase 1 (Hiragana).
      } catch (error) {
        console.error('Error fetching translations', error);
      }
    }

    loadTranslations();
  }, []);

  useEffect(() => {
    if (srs !== null) {
      setCurrentTranslation(srs.getNext());
      setQuizPhase(1); // Start with phase 1 (Hiragana).
    }
  }, [srs]);

  const handleInputChange = (event) => {
    const input = event.target.value;
    setUserInput(input); // Keep track of the raw user input

    // Conditionally convert to hiragana only when quizzing hiragana.
    const convertedHiragana = quizPhase === 1 ? toKana(input, { IMEMode: 'Romaji' }) : input;
    setHiraganaInput(convertedHiragana);
  };

  const handleEnterKey = (event) => {
    if (event.key === 'Enter') {
      if (quizPhase === 1 || quizPhase === 3) {
        // Phase 1 or 3: Check the answer and move to the feedback phase.
        checkAnswer();
      } else if (quizPhase === 2 || quizPhase === 4) {
        // Phase 2 or 4: Move to the next question and reset feedback.
        nextQuestion();
      }
    }
  };

  const checkAnswer = () => {
    if (currentTranslation) {
      let success = false;
      let correctAnswer = '';

      if (quizPhase === 1) {
        // Phase 1: Check Hiragana.
        success = hiraganaInput.toLowerCase() === currentTranslation.hiragana.toLowerCase();
        correctAnswer = `Correct Hiragana: ${currentTranslation.hiragana}`;
      } else if (quizPhase === 3) {
        // Phase 3: Check English.
        success = userInput.toLowerCase() === currentTranslation.english.toLowerCase();
        correctAnswer = `Correct English: ${currentTranslation.english}`;
      }

      if (success) {
        setFeedback('Correct!');
        setNumCorrectAnswers(numCorrectAnswers + 1); // Increment the correct answer count
      } else {
        setFeedback('Incorrect!');
      }
      setCorrectAnswer(correctAnswer); // Set the correct answer for display.

      setQuizPhase(quizPhase + 1); // Move to the feedback phase.
    }
  };

  const nextQuestion = () => {
    setFeedback('');
    setUserInput('');
    setHiraganaInput(''); // Clear the converted hiragana input
    setCorrectAnswer('');
    setQuizPhase((quizPhase % 4) + 1); // Move to the next question phase (1 to 4).
    if (quizPhase === 4) {
      srs.processFeedback(currentTranslation, numCorrectAnswers === 2);
      handleSaveProgress(currentTranslation);
      setNumCorrectAnswers(0);
      setCurrentTranslation(srs.getNext()); // Advance to the next question.
    }
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
          <p>Japanese: {currentTranslation.japanese}</p>
          {quizPhase === 1 || quizPhase === 2 ? (
            <>
              <p>{'What is the hiragana reading?'}</p>
            </>
          ) : (
            <>
              <p>{'What is the English reading?'}</p>
            </>
          )}
          <input
            type="text"
            value={hiraganaInput}
            onChange={handleInputChange}
            onKeyPress={handleEnterKey}
            className="translation-input"
          />
          <p className={`translation-feedback ${feedback === 'Correct!' ? 'correct-answer' : feedback === 'Incorrect!' ? 'incorrect-feedback' : ''}`}>{feedback}</p>

          {feedback === 'Incorrect!' && (
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
