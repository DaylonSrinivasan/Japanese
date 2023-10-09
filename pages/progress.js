import React, { useEffect, useState } from 'react';
import { fetchUserProgress } from '../lib/graphql_client';

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
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, []);

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
                  <td>{vocabulary.lastSeen}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No data available.</p>
      )}
    </div>
  );
}

export default UserProfilePage;
