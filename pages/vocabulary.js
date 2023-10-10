// VocabularyQuiz.js
import React, { useState, useEffect } from 'react';
import { fetchUserProgress, updateUserProgress } from '../lib/graphql_client';
import { SRS } from '../lib/srs';
import '../styles/vocabulary_quiz.css';

const USERNAME = 'daylon';

function VocabularyQuiz() {
  const [currentVocabulary, setCurrentVocabulary] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState('');
  const [srs, setSRS] = useState(null);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [enterPressCount, setEnterPressCount] = useState(0);

  // Define showHint outside the if (currentVocabulary) block.
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    async function loadVocabularies() {
      try {
        const fetchedVocabularies = await fetchUserProgress(USERNAME);
        setSRS(new SRS(fetchedVocabularies));
        setCurrentVocabulary(srs.getNext());
      } catch (error) {
        console.error('Error fetching vocabularies', error);
      }
    }

    loadVocabularies();
  }, []);

  useEffect(() => {
    if (srs !== null) {
      setCurrentVocabulary(srs.getNext());
    }
  }, [srs]);

  const handleInputChange = (event) => {
    setUserInput(event.target.value);
  };

  const handleEnterKey = (event) => {
    if (event.key === 'Enter') {
      if (enterPressCount === 0) {
        // On the first Enter press, display feedback and show the hint.
        checkAnswer();
        setEnterPressCount(1);
      } else {
        // On the second Enter press, advance to the next question.
        nextQuestion();
        setEnterPressCount(0);
      }
    }
  };

  const checkAnswer = () => {
    if (currentVocabulary) {
      const success = userInput.toLowerCase() === currentVocabulary.english.toLowerCase();
      const feedback = success ? 'Correct!' : 'Incorrect!';
      setFeedback(feedback);

      if (!success) {
        // If the answer is incorrect, set the correct answer for display.
        setCorrectAnswer(`Correct answer: ${currentVocabulary.english}`);
      } else {
        setCorrectAnswer(''); // Clear the correct answer when the answer is correct.
      }

      srs.processFeedback(currentVocabulary, success);
      setUserInput('');
    }
  };

  const nextQuestion = () => {
    setFeedback('');
    setCorrectAnswer('');
    setCurrentVocabulary(srs.getNext());
    setShowHint(false); // Hide the hint when moving to the next question.
  };

  const showHintClick = () => {
    setShowHint(true); // Display the hint (hiragana) when the hint button is clicked.
  };

  const handleSaveProgress = async () => {
    try {
      await updateUserProgress(USERNAME, srs.items);
      setFeedback('Progress saved!');
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
          <p>Level: {currentVocabulary.level}</p>
          <p>Last Seen: {currentVocabulary.lastSeen.toLocaleString()}</p>
          <input
            type="text"
            value={userInput}
            onChange={handleInputChange}
            onKeyPress={handleEnterKey}
            className="vocabulary-input"
          />
          <div className="button-container">
            <button onClick={showHintClick} className="vocabulary-button">
              Hint
            </button>
          </div>
          <p className="vocabulary-feedback">{feedback}</p>

          {feedback === 'Incorrect!' && (
            <p className="correct-answer">{correctAnswer}</p>
          )}

          {showHint && (
            <p className="vocabulary-hint">
              Hiragana Hint: {currentVocabulary.hiragana}
            </p>
          )}
        </div>
      )}

      <button onClick={handleSaveProgress} className="save-button">
        Save Progress
      </button>
    </div>
  );
}

export default VocabularyQuiz;
