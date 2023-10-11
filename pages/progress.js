import React, { useEffect, useState } from 'react';
import { fetchUserProgress, updateUserProgress } from '../lib/graphql_client';
import Translation from '../resources/translation';

function UserProfilePage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [translations, setTranslations] = useState([]);

  useEffect(() => {
    const userName = 'daylon'; // Replace with the user name you want to fetch

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
    const resetTranslations = translations.map((translation) => new Translation(
      translation.japanese,
      translation.hiragana,
      translation.english,
      0, // Reset level to 0
      currentTime, // Set lastSeen to the current time
    ));

    try {
      // Use the updateUserProgress method to save the reset values in the database
      await updateUserProgress('daylon', resetTranslations);

      // Update the state with the reset values
      setTranslations(resetTranslations);
    } catch (err) {
      setError(err);
    }
  };

  return (
    <div>
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
                <th>Level</th>
                <th>Last Seen</th>
              </tr>
            </thead>
            <tbody>
              {translations.map((translation, index) => (
                <tr key={index}>
                  <td>{translation.english}</td>
                  <td>{translation.japanese}</td>
                  <td>{translation.hiragana}</td>
                  <td>{translation.level}</td>
                  <td>{translation.lastSeen.toLocaleString()}</td>
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

export default UserProfilePage;
