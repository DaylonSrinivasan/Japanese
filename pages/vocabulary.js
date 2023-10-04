import { gql, useQuery } from "@apollo/client";

function App() {
  const VOCAB_QUERY = gql`
    query {
        vocabularies {
        japanese
        hiragana
        english
        }
    }
  `;
  const { loading, error, data } = useQuery(VOCAB_QUERY);

  if (error) return <p>Error</p>;
  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Vocabulary</h1>
      <h2>Results</h2>
      <table>
        <thead>
          <tr>
            <th>Japanese</th>
            <th>Hiragana</th>
            <th>English</th>
          </tr>
        </thead>
        <tbody>
          {data &&
            data.vocabularies &&
            data.vocabularies.map((vocab, index) => (
              <tr key={index}>
                <td>{vocab.japanese}</td>
                <td>{vocab.hiragana}</td>
                <td>{vocab.english}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;