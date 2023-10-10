import React, { useEffect, useState } from 'react';
import { fetchUserProgress, updateUserProgress } from '../lib/graphql_client';
import Vocabulary from '../resources/vocabulary';

function UserProfilePage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [vocabularies, setVocabularies] = useState([]);

  useEffect(() => {
    const userName = 'daylon'; // Replace with the user name you want to fetch

    fetchUserProgress(userName)
      .then((result) => {
        if (result) {
          setVocabularies(result);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  const resetVocabularies = async () => {
    const currentTime = new Date().toISOString();

    // Create an array of Vocabulary objects with reset values
    const resetVocabularies = vocabularies.map((vocabulary) => new Vocabulary(
      vocabulary.japanese,
      vocabulary.hiragana,
      vocabulary.english,
      0, // Reset level to 0
      currentTime, // Set lastSeen to the current time
    ));

    try {
      // Use the updateUserProgress method to save the reset values in the database
      await updateUserProgress('daylon', resetVocabularies);

      // Update the state with the reset values
      setVocabularies(resetVocabularies);
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
      ) : vocabularies.length > 0 ? (
        <div>
          <h1>Daylons Vocabulary Progress</h1>
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
              {vocabularies.map((vocabulary, index) => (
                <tr key={index}>
                  <td>{vocabulary.english}</td>
                  <td>{vocabulary.japanese}</td>
                  <td>{vocabulary.hiragana}</td>
                  <td>{vocabulary.level}</td>
                  <td>{vocabulary.lastSeen.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={resetVocabularies}>Reset</button>
        </div>
      ) : (
        <p>No data available.</p>
      )}
    </div>
  );
}

export default UserProfilePage;
