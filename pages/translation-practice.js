import React, { Component } from 'react';
import Layout from '../components/layout'
import prisma from '../lib/prisma';

export async function getStaticProps() {
  const sentences = (await prisma.sentence.findMany());
  return {
    props: {
      sentences,
    },
  };
}

class TranslationApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sentences: props.sentences,
      currentIndex: 0, // Index of the current translation
      userInput: '', // User input text
      isCorrect: null, // Indicator for correctness
      showHiragana: false, // Indicates whether to show hiragana
      correctTranslation: '', // Store the correct translation
    };
  }

  handleUserInputChange = (event) => {
    this.setState({ userInput: event.target.value });
  };

  handleSubmit = () => {
    const { sentences, currentIndex, userInput } = this.state;
    const currentSentence = sentences[currentIndex];

    // Check if the user input matches the English translation
    if (userInput.toLowerCase() === currentSentence.english.toLowerCase()) {
      this.setState({ isCorrect: true });
    } else {
      this.setState({
        isCorrect: false,
        correctTranslation: currentSentence.english, // Store the correct translation
      });
    }

    // Move to a random translation.
    this.setState((prevState) => ({
      currentIndex: Math.floor(Math.random() * sentences.length),
      userInput: '', // Clear user input for the next translation
      showHiragana: false, // Hide hiragana for the next translation
    }));
  };

  handleHintButtonClick = () => {
    this.setState({ showHiragana: true });
  };

  handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      this.handleSubmit();
    }
  };

  render() {
    const {
      sentences,
      currentIndex,
      userInput,
      isCorrect,
      showHiragana,
      correctTranslation,
    } = this.state;
    const currentSentence = sentences[currentIndex];

    return (
      <Layout>
        <div>
          {/* Japanese text to display to the user */}
          <p>{currentSentence.japanese}</p>
        </div>
        <div>
          {/* Hiragana hint */}
          {showHiragana && <p>{currentSentence.hiragana}</p>}
        </div>
        <div>
          {/* User input text box */}
          <input
            type="text"
            value={userInput}
            onChange={this.handleUserInputChange}
            onKeyPress={this.handleKeyPress}
            placeholder="Enter the English translation"
          />
        </div>
        <div>
          {/* Hint button */}
          <button onClick={this.handleHintButtonClick}>Hint</button>
        </div>
        <div>
          {/* Submit button */}
          <button onClick={this.handleSubmit}>Submit</button>
        </div>
        <div>
          {/* Indication of correctness/failure */}
          {isCorrect === true && (
            <p style={{ color: 'green' }}>Correct translation!</p>
          )}
          {isCorrect === false && (
            <p style={{ color: 'red' }}>
              Incorrect translation. The correct translation is: {correctTranslation}
            </p>
          )}
        </div>
      </Layout>
    );
  }
}

export default TranslationApp;