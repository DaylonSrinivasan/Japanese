import React, { useEffect, useState } from 'react';
import { fetchUserProgress } from '../lib/graphql_client';

function UserProfilePage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    const userName = 'daylon'; // Replace with the user name you want to fetch

    fetchUserProgress(userName)
      .then((result) => {
        if (result) {
          setData(result);
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
      ) : data ? (
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
              {data.users[0]?.vocabularyConnection.edges.map((edge, index) => (
                <tr key={index}>
                  <td>{edge.node.english}</td>
                  <td>{edge.node.japanese}</td>
                  <td>{edge.node.hiragana}</td>
                  <td>{edge.level}</td>
                  <td>{edge.lastSeen}</td>
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
