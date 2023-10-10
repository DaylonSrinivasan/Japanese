import React, { useState, useEffect } from 'react';
import { fetchUserProgress, updateUserProgress } from '../lib/graphql_client';
import { SRS } from '../lib/srs';

const USERNAME = 'daylon';

function VocabularyQuiz() {
  const [currentVocabulary, setCurrentVocabulary] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState('');
  const [srs, setSRS] = useState(null);

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
      checkAnswer();
    }
  };

  const checkAnswer = () => {
    if (currentVocabulary) {
      const success = (userInput.toLowerCase() === currentVocabulary.english.toLowerCase());
      const feedback = success ? 'Correct!' : 'Incorrect!';
      setFeedback(feedback);
      srs.processFeedback(currentVocabulary, success);
      setUserInput('');
      setCurrentVocabulary(srs.getNext());
    }
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
    <div>
      <div>
        <h2>Vocabulary Quiz</h2>
      </div>

      {currentVocabulary && (
        <div>
          <p>Japanese: {currentVocabulary.japanese}</p>
          <p>Level: {currentVocabulary.level}</p>
          <p>Last Seen: {currentVocabulary.lastSeen.toLocaleString()}</p>
          <input
            type="text"
            value={userInput}
            onChange={handleInputChange}
            onKeyPress={handleEnterKey}
          />
          <button onClick={checkAnswer}>Submit</button>
          <p>{feedback}</p>
        </div>
      )}

      <button onClick={handleSaveProgress}>Save Progress</button>
    </div>
  );
}

export default VocabularyQuiz;
