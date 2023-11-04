import React, { useEffect, useState } from 'react';
import { fetchUserProgress, updateUserProgress } from '../lib/graphql_client';
import { LEVEL_DELAYS } from '../lib/srs';
import '../styles/progress.css'

function UserProfilePage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [translations, setTranslations] = useState([]);

  useEffect(() => {
    const userName = 'daylon';

    fetchUserProgress(userName)
      .then((result) => {
        if (result) {
          setTranslations(result);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  const resetTranslations = async () => {
    const currentTime = new Date().toISOString();

    // Create an array of Translation objects with reset values
    const resetTranslations = translations.map((translation) => ({
      ...translation,
      level: 0, // Reset level to 0
      lastSeen: currentTime, // Set lastSeen to the current time
    }));

    try {
      // Use the updateUserProgress method to save the reset values in the database
      await updateUserProgress('daylon', resetTranslations);

      // Update the state with the reset values
      setTranslations(resetTranslations);
    } catch (err) {
      setError(err);
    }
  };

  translations.forEach((translation) => {
    const now = new Date();
    translation.millisUntilNextQuiz = Math.floor(Math.max(0, translation.lastSeen.getTime() + LEVEL_DELAYS[translation.level] - now.getTime()));
  })

  // Sort the translations by millisUntilNextQuiz, level and lastSeen in ascending order
  translations.sort((a, b) => {
    if (a.millisUntilNextQuiz !== b.millisUntilNextQuiz) {
      return a.millisUntilNextQuiz - b.millisUntilNextQuiz;
    }
    else if (a.level !== b.level) {
      return b.level - a.level;
    } else {
      return a.lastSeen - b.lastSeen;
    }
  });

  return (
    <div className="container">
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error.message}</p>
      ) : translations.length > 0 ? (
        <div>
          <h1>Daylons Translation Progress</h1>
          <table>
            <thead>
              <tr>
                <th>English</th>
                <th>Japanese</th>
                <th>Hiragana</th>
                <th>Target Chacter Set</th>
                <th>Level</th>
                <th>Last Seen</th>
                <th>Time until next quiz</th>
              </tr>
            </thead>
            <tbody>
              {translations.map((translation, index) => (
                <tr key={index}>
                  <td>{translation.english}</td>
                  <td>{translation.japanese}</td>
                  <td>{translation.hiragana}</td>
                  <td>{translation.targetCharacterSet}</td>
                  <td>{translation.level}</td>
                  <td>{new Date(translation.lastSeen).toLocaleString()}</td>
                  <td>{getTimeUntil(translation.millisUntilNextQuiz)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={resetTranslations}>Reset</button>
        </div>
      ) : (
        <p>No data available.</p>
      )}
    </div>
  );
}

function getTimeUntil(timeInMillis) {
  const days = Math.floor(timeInMillis / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeInMillis % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeInMillis % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeInMillis % (1000 * 60) / 1000));

  let formattedTime = '';
  
  if (days > 0) {
    formattedTime += `${days} days, `;
  }
  if (hours > 0) {
    formattedTime += `${hours} hours, `;
  }
  if (minutes > 0) {
    formattedTime += `${minutes} minutes, `;
  }
  formattedTime += `${seconds} seconds`;

  return formattedTime;
}

export default UserProfilePage;
