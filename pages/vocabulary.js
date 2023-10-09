import React, { useState, useEffect } from 'react';
import { fetchUserProgress, updateUserProgress } from '../lib/graphql_client';
import { DateTime } from "neo4j-driver";

const USERNAME = 'daylon';

function VocabularyQuiz() {
  const [vocabularies, setVocabularies] = useState([]);
  const [currentVocabulary, setCurrentVocabulary] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    async function loadVocabularies() {
      try {
        const fetchedVocabularies = await fetchUserProgress(USERNAME);
        setVocabularies(fetchedVocabularies);
        selectRandomVocabulary(fetchedVocabularies);
      } catch (error) {
        console.error('Error fetching vocabularies', error);
      }
    }

    loadVocabularies();
  }, []);

  const selectRandomVocabulary = (vocabList) => {
    const randomIndex = Math.floor(Math.random() * vocabList.length);
    setCurrentVocabulary(vocabList[randomIndex]);
  };

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
      if (userInput.toLowerCase() === currentVocabulary.english.toLowerCase()) {
        setFeedback('Correct!');
        // Increment the level
        currentVocabulary.level++;
      } else {
        setFeedback('Incorrect!');
        // Decrement the level, but not below 0
        currentVocabulary.level = Math.max(0, currentVocabulary.level - 1);
      }
      currentVocabulary.lastSeen = new Date();

      setUserInput('');
      selectRandomVocabulary(vocabularies);
    }
  };

  const handleSaveProgress = async () => {
    try {
      await updateUserProgress(USERNAME, vocabularies);
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
          <p>Last Seen: {currentVocabulary.lastSeen}</p>
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
