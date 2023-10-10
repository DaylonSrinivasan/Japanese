// VocabularyQuiz.js
import React, { useState, useEffect } from 'react';
import { fetchUserProgress, updateUserProgress } from '../lib/graphql_client';
import { SRS } from '../lib/srs';
import '../styles/vocabulary_quiz.css';
import { toKana } from 'wanakana';

const USERNAME = 'daylon';

function VocabularyQuiz() {
  const [currentVocabulary, setCurrentVocabulary] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [hiraganaInput, setHiraganaInput] = useState(''); // Store the converted hiragana input
  const [feedback, setFeedback] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [numCorrectAnswers, setNumCorrectAnswers] = useState(0);
  const [srs, setSRS] = useState(null);
  const [quizPhase, setQuizPhase] = useState(1); // 1: Hiragana, 2: Hiragana Feedback, 3: English, 4: English Feedback

  useEffect(() => {
    async function loadVocabularies() {
      try {
        const fetchedVocabularies = await fetchUserProgress(USERNAME);
        setSRS(new SRS(fetchedVocabularies));
        setCurrentVocabulary(srs.getNext());
        setQuizPhase(1); // Start with phase 1 (Hiragana).
      } catch (error) {
        console.error('Error fetching vocabularies', error);
      }
    }

    loadVocabularies();
  }, []);

  useEffect(() => {
    if (srs !== null) {
      setCurrentVocabulary(srs.getNext());
      setQuizPhase(1); // Start with phase 1 (Hiragana).
    }
  }, [srs]);

  const handleInputChange = (event) => {
    const input = event.target.value;
    setUserInput(input); // Keep track of the raw user input.
  
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
    if (currentVocabulary) {
      let success = false;
      let correctAnswer = '';

      if (quizPhase === 1) {
        // Phase 1: Check Hiragana.
        success = hiraganaInput.toLowerCase() === currentVocabulary.hiragana.toLowerCase();
        correctAnswer = `Correct Hiragana: ${currentVocabulary.hiragana}`;
      } else if (quizPhase === 3) {
        // Phase 3: Check English.
        success = userInput.toLowerCase() === currentVocabulary.english.toLowerCase();
        correctAnswer = `Correct English: ${currentVocabulary.english}`;
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
      srs.processFeedback(currentVocabulary, numCorrectAnswers === 2);
      handleSaveProgress();
      setNumCorrectAnswers(0);
      setCurrentVocabulary(srs.getNext()); // Advance to the next question.
    }
  };

  const handleSaveProgress = async () => {
    try {
      await updateUserProgress(USERNAME, srs.items);
    } catch (error) {
      console.error('Error saving progress', error);
      setFeedback('Error saving progress');
    }
  };

  return (
    <div className="vocabulary-container">
      <div className="vocabulary-header text-center">
        <h2>Vocabulary Quiz</h2>
      </div>

      {currentVocabulary && (
        <div className="vocabulary-card">
          <p>Japanese: {currentVocabulary.japanese}</p>
          {quizPhase === 1 || quizPhase === 2 ? (
            <>
              <p>{'What is the hiragana reading?'}</p>
            </>
          ) : (
            <>
              <p>{'What is the English reading?'}</p>
            </>
          )}
          <p>Level: {currentVocabulary.level}</p>
          <p>Last Seen: {currentVocabulary.lastSeen.toLocaleString()}</p>
          <input
            type="text"
            value={hiraganaInput}
            onChange={handleInputChange}
            onKeyPress={handleEnterKey}
            className="vocabulary-input"
          />
          <p className="vocabulary-feedback">{feedback}</p>

          {feedback === 'Incorrect!' && (
            <p className="correct-answer">{correctAnswer}</p>
          )}
        </div>
      )}
    </div>
  );
}

export default VocabularyQuiz;
