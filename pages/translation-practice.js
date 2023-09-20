import React, { Component } from 'react';
import Layout from '../components/layout'

class TranslationApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      translations: [
        { japanese: 'こんにちは', hiragana: 'こんにちは', english: 'hello' },
        { japanese: 'こんばんは', hiragana: 'こんばんは', english: 'good evening' },
        { japanese: 'ありがとう', hiragana: 'ありがとう', english: 'thank you' },
        { japanese: 'おはよう', hiragana: 'おはよう', english: 'good morning' },
        { japanese: 'おやすみ', hiragana: 'おやすみ', english: 'good night' },
        { japanese: 'はい', hiragana: 'はい', english: 'yes' },
        { japanese: 'いいえ', hiragana: 'いいえ', english: 'no' },
        { japanese: 'すみません', hiragana: 'すみません', english: 'excuse me' },
        { japanese: 'お願いします', hiragana: 'おねがいします', english: 'please' },
        { japanese: 'ごめんなさい', hiragana: 'ごめんなさい', english: 'I\'m sorry' },
        { japanese: 'どうぞ', hiragana: 'どうぞ', english: 'here you go' },
        { japanese: '失礼しました', hiragana: 'しつれいしました', english: 'I apologize' },
        { japanese: 'おめでとう', hiragana: 'おめでとう', english: 'congratulations' },
        { japanese: 'いただきます', hiragana: 'いただきます', english: 'let\'s eat' },
        { japanese: '乾杯', hiragana: 'かんぱい', english: 'cheers' },
        { japanese: 'お疲れ様', hiragana: 'おつかれさま', english: 'thank you for your hard work' },
        { japanese: 'はじめまして', hiragana: 'はじめまして', english: 'nice to meet you' },
        { japanese: 'お元気ですか', hiragana: 'おげんきですか', english: 'how are you?' },
        { japanese: '大丈夫', hiragana: 'だいじょうぶ', english: 'I\'m okay' },
        { japanese: 'わかりません', hiragana: 'わかりません', english: 'I don\'t know' },
        { japanese: 'お誕生日おめでとう', hiragana: 'おたんじょうびおめでとう', english: 'happy birthday' },
        { japanese: 'お幸せをお祈りします', hiragana: 'おしあわせをおいのりします', english: 'best wishes' },
        { japanese: 'おいしい', hiragana: 'おいしい', english: 'delicious' },
        { japanese: '美しい', hiragana: 'うつくしい', english: 'beautiful' },
        { japanese: '楽しい', hiragana: 'たのしい', english: 'fun' },
        { japanese: '大好き', hiragana: 'だいすき', english: 'I love you' },
        { japanese: 'ありがとうございます', hiragana: 'ありがとうごさいます', english: 'thank you very much' },
        { japanese: '明日は雨が降ります', hiragana: 'あしたはあめがふります', english: 'It will rain tomorrow' },
        { japanese: '日本語を話せますか', hiragana: 'にほんごをはなせますか', english: 'Can you speak Japanese?' },
        { japanese: 'お腹が空いた', hiragana: 'おなかがすいた', english: 'I\'m hungry' },
        { japanese: '元気です', hiragana: 'げんきです', english: 'I\'m fine' },
        { japanese: '行ってきます', hiragana: 'いってきます', english: 'I\'ll be back' },
        { japanese: 'お疲れ様でした', hiragana: 'おつかれさまでした', english: 'Thank you for your work' },
        { japanese: 'あなたの名前は何ですか', hiragana: 'あなたのなまえはなんですか', english: 'What is your name?' },
        { japanese: 'いくらですか', hiragana: 'いくらですか', english: 'How much is it?' },
        { japanese: 'お願いします', hiragana: 'おねがいします', english: 'please' },
        { japanese: '大丈夫です', hiragana: 'だいじょうぶです', english: 'It\'s okay' },
        { japanese: 'すごい', hiragana: 'すごい', english: 'amazing' },
        { japanese: 'お疲れさまでした', hiragana: 'おつかれさまでした', english: 'Good job' },
        { japanese: '日本へ行きたい', hiragana: 'にほんへいきたい', english: 'I want to go to Japan' },
        { japanese: 'ありがとうございます', hiragana: 'ありがとうございます', english: 'Thank you very much' },
        { japanese: 'どうしたの', hiragana: 'どうしたの', english: 'What happened?' },
        { japanese: 'これは何ですか', hiragana: 'これはなんですか', english: 'What is this?' },
        { japanese: 'すみません', hiragana: 'すみません', english: 'I\'m sorry' },
        { japanese: 'どうぞお願いします', hiragana: 'どうぞおねがいします', english: 'Please, if you don’t mind' },
        { japanese: 'お疲れ様でした', hiragana: 'おつかれさまでした', english: 'Thank you for your hard work' },
        { japanese: '今何時ですか', hiragana: 'いまなんじですか', english: 'What time is it?' },
        { japanese: '新しい車を買いました', hiragana: 'あたらしいくるまをかいました', english: 'I bought a new car' },
        { japanese: 'これは本です', hiragana: 'これはほんです', english: 'This is a book' },
        { japanese: '日本食が好き', hiragana: 'にほんしょくがすき', english: 'I like Japanese food' },
        { japanese: '魚が好きですか', hiragana: 'さかながすきですか', english: 'Do you like fish?' },
        { japanese: 'どこに住んでいますか', hiragana: 'どこにすんでいますか', english: 'Where do you live?' },
        { japanese: '明日は晴れます', hiragana: 'あしたははれます', english: 'It will be sunny tomorrow' },
        { japanese: '彼女は英語を話せます', hiragana: 'かのじょはえいごをはなせます', english: 'She can speak English' },
        { japanese: 'それはとても便利です', hiragana: 'それはとてもべんりです', english: 'That is very convenient' },
        { japanese: '彼は学生です', hiragana: 'かれはがくせいです', english: 'He is a student' },
        { japanese: '好きな色は何ですか', hiragana: 'すきないろはなんですか', english: 'What is your favorite color?' },
        { japanese: '私は医者ではありません', hiragana: 'わたしはいしゃではありません', english: 'I am not a doctor' },
        { japanese: 'いい天気です', hiragana: 'いいてんきです', english: 'The weather is nice' },
        { japanese: '明日は雪が降ります', hiragana: 'あしたはゆきがふります', english: 'It will snow tomorrow' },
        { japanese: 'お金がありません', hiragana: 'おかねがありません', english: 'I don\'t have money' },
        { japanese: '彼女はとても美しいです', hiragana: 'かのじょはとてもうつくしいです', english: 'She is very beautiful' },
        { japanese: '本を読みます', hiragana: 'ほんをよみます', english: 'I read a book' },
        { japanese: 'これは私の車です', hiragana: 'これはわたしのくるまです', english: 'This is my car' },
        { japanese: 'テレビを見ます', hiragana: 'テレビをみます', english: 'I watch TV' },
        { japanese: 'お風呂に入ります', hiragana: 'おふろにはいります', english: 'I take a bath' },
        { japanese: '新しい仕事を始めます', hiragana: 'あたらしいしごとをはじめます', english: 'I start a new job' },
        { japanese: 'これは食べられません', hiragana: 'これはたべられません', english: 'This cannot be eaten' },
        { japanese: '日本語を勉強します', hiragana: 'にほんごをべんきょうします', english: 'I study Japanese' },
        { japanese: '彼は先生です', hiragana: 'かれはせんせいです', english: 'He is a teacher' },
        { japanese: '日本に行きます', hiragana: 'にほんにいきます', english: 'I go to Japan' },
        { japanese: '彼女は元気です', hiragana: 'かのじょはげんきです', english: 'She is energetic' },
        { japanese: 'お茶を飲みます', hiragana: 'おちゃをのみます', english: 'I drink tea' },
        { japanese: '日本語が難しいです', hiragana: 'にほんごがむずかしいです', english: 'Japanese is difficult' },
        { japanese: '彼は友達です', hiragana: 'かれはともだちです', english: 'He is a friend' },
        { japanese: '猫がいます', hiragana: 'ねこがいます', english: 'There is a cat' },
        { japanese: 'これはペンです', hiragana: 'これはぺんです', english: 'This is a pen' },
        { japanese: '彼女は犬が嫌い', hiragana: 'かのじょはいぬがきらい', english: 'She dislikes dogs' },
        { japanese: '電話をかけます', hiragana: 'でんわをかけます', english: 'I make a phone call' },
        { japanese: '昨日は寒かった', hiragana: 'きのうはさむかった', english: 'Yesterday was cold' },
        { japanese: 'これは何ですか', hiragana: 'これはなんですか', english: 'What is this?' },
        { japanese: '彼は日本人です', hiragana: 'かれはにほんじんです', english: 'He is Japanese' },
        { japanese: 'お金を持っています', hiragana: 'おかねをもっています', english: 'I have money' },
        { japanese: '雨が降っています', hiragana: 'あめがふっています', english: 'It is raining' },
        { japanese: 'これは赤いです', hiragana: 'これはあかいです', english: 'This is red' },
        { japanese: 'これはペンですか', hiragana: 'これはぺんですか', english: 'Is this a pen?' },
        { japanese: '家に帰ります', hiragana: 'いえにかえります', english: 'I go home' },
        { japanese: '彼女は優しいです', hiragana: 'かのじょはやさしいです', english: 'She is kind' },
        { japanese: '寿司が好きです', hiragana: 'すしがすきです', english: 'I like sushi' },
        { japanese: '犬がいます', hiragana: 'いぬがいます', english: 'There is a dog' },
        { japanese: '彼は高いです', hiragana: 'かれはたかいです', english: 'He is tall' },
        { japanese: '友達と遊びます', hiragana: 'ともだちとあそびます', english: 'I play with friends' },
        { japanese: 'これは本ですか', hiragana: 'これはほんですか', english: 'Is this a book?' },
        { japanese: '彼女は綺麗です', hiragana: 'かのじょはきれいです', english: 'She is beautiful' },
        { japanese: '彼は面白いです', hiragana: 'かれはおもしろいです', english: 'He is interesting' },
        { japanese: 'これは私の家です', hiragana: 'これはわたしのいえです', english: 'This is my house' },
        { japanese: '日本語が上手です', hiragana: 'にほんごがじょうずです', english: 'I am good at Japanese' },
        { japanese: '鳥が飛んでいます', hiragana: 'とりがとんでいます', english: 'A bird is flying' },
        { japanese: '彼は若いです', hiragana: 'かれはわかいです', english: 'He is young' },
        { japanese: '私は大学生です', hiragana: 'わたしはだいがくせいです', english: 'I am a college student' },
        { japanese: '彼女は忙しいです', hiragana: 'かのじょはいそがしいです', english: 'She is busy' },
        { japanese: 'これは黒いです', hiragana: 'これはくろいです', english: 'This is black' },
        { japanese: '彼は強いです', hiragana: 'かれはつよいです', english: 'He is strong' },
        { japanese: '日本に住んでいます', hiragana: 'にほんにすんでいます', english: 'I live in Japan' },
        { japanese: '彼女は英語が得意', hiragana: 'かのじょはえいごがとくい', english: 'She is good at English' },
        { japanese: '彼は笑顔です', hiragana: 'かれはえがおです', english: 'He is smiling' },
        { japanese: '彼女は元気ですか', hiragana: 'かのじょはげんきですか', english: 'Is she energetic?' },
        { japanese: 'これは食べ物です', hiragana: 'これはたべものです', english: 'This is food' },
        { japanese: 'お母さんがいます', hiragana: 'おかあさんがいます', english: 'There is a mother' },
        { japanese: '彼は速いです', hiragana: 'かれははやいです', english: 'He is fast' },
        { japanese: '今日は暑いです', hiragana: 'きょうはあついです', english: 'Today is hot' },
        { japanese: '彼女は疲れています', hiragana: 'かのじょはつかれています', english: 'She is tired' },
        { japanese: 'これは私の本です', hiragana: 'これはわたしのほんです', english: 'This is my book' },
        { japanese: '彼は静かです', hiragana: 'かれはしずかです', english: 'He is quiet' },
        { japanese: '日本に行きたいです', hiragana: 'にほんにいきたいです', english: 'I want to go to Japan' },
        { japanese: 'お父さんがいます', hiragana: 'おとうさんがいます', english: 'There is a father' },
        { japanese: '彼女は優れています', hiragana: 'かのじょはすぐれています', english: 'She is excellent' },
        { japanese: 'これは動物です', hiragana: 'これはどうぶつです', english: 'This is an animal' },
        { japanese: '彼は優しいです', hiragana: 'かれはやさしいです', english: 'He is kind' },
        { japanese: '今日は寒いです', hiragana: 'きょうはさむいです', english: 'Today is cold' },
        { japanese: '彼女は静かです', hiragana: 'かのじょはしずかです', english: 'She is quiet' },
        { japanese: 'これは魚です', hiragana: 'これはさかなです', english: 'This is a fish' },
        { japanese: '彼は忙しいです', hiragana: 'かれはいそがしいです', english: 'He is busy' },
        { japanese: '今日は雨です', hiragana: 'きょうはあめです', english: 'Today is rainy' },
        { japanese: '彼女は元気です', hiragana: 'かのじょはげんきです', english: 'She is energetic' },
        { japanese: 'これは猫です', hiragana: 'これはねこです', english: 'This is a cat' },
        { japanese: '彼は大きいです', hiragana: 'かれはおおきいです', english: 'He is big' },
        { japanese: '今日は晴れです', hiragana: 'きょうははれです', english: 'Today is sunny' },
        { japanese: '彼女は若いです', hiragana: 'かのじょはわかいです', english: 'She is young' },
        { japanese: 'これは車です', hiragana: 'これはくるまです', english: 'This is a car' },
        { japanese: '彼は面白いです', hiragana: 'かれはおもしろいです', english: 'He is interesting' },
        { japanese: '今日は暖かいです', hiragana: 'きょうはあたたかいです', english: 'Today is warm' },
        { japanese: '彼女は小さいです', hiragana: 'かのじょはちいさいです', english: 'She is small' },
        { japanese: 'これは鳥です', hiragana: 'これはとりです', english: 'This is a bird' },
        { japanese: '彼は優れています', hiragana: 'かれはすぐれています', english: 'He is excellent' },
        // Add more translations here...
      ],
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
    const { translations, currentIndex, userInput } = this.state;
    const currentTranslation = translations[currentIndex];

    // Check if the user input matches the English translation
    if (userInput.toLowerCase() === currentTranslation.english.toLowerCase()) {
      this.setState({ isCorrect: true });
    } else {
      this.setState({
        isCorrect: false,
        correctTranslation: currentTranslation.english, // Store the correct translation
      });
    }

    // Move to a random translation.
    this.setState((prevState) => ({
      currentIndex: Math.floor(Math.random() * translations.length),
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
      translations,
      currentIndex,
      userInput,
      isCorrect,
      showHiragana,
      correctTranslation,
    } = this.state;
    const currentTranslation = translations[currentIndex];

    return (
      <Layout>
        <div>
          {/* Japanese text to display to the user */}
          <p>{currentTranslation.japanese}</p>
        </div>
        <div>
          {/* Hiragana hint */}
          {showHiragana && <p>{currentTranslation.hiragana}</p>}
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