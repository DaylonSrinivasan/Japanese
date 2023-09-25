MERGE (v:Vocabulary {japanese: "私は勉強しています"})
ON CREATE SET v.hiragana = "わたしはべんきょうしています", v.english = "I am studying";

MERGE (v:Vocabulary {japanese: "こんにちは"})
ON CREATE SET v.hiragana = "こんにちは", v.english = "Hello";

MERGE (v:Vocabulary {japanese: "おはよう"})
ON CREATE SET v.hiragana = "おはよう", v.english = "Good morning";

MERGE (v:Vocabulary {japanese: "こんばんは"})
ON CREATE SET v.hiragana = "こんばんは", v.english = "Good evening";

MERGE (v:Vocabulary {japanese: "ありがとう"})
ON CREATE SET v.hiragana = "ありがとう", v.english = "Thank you";

MERGE (v:Vocabulary {japanese: "すごい"})
ON CREATE SET v.hiragana = "すごい", v.english = "Awesome";

MERGE (v:Vocabulary {japanese: "猫"})
ON CREATE SET v.hiragana = "ねこ", v.english = "Cat";

MERGE (v:Vocabulary {japanese: "犬"})
ON CREATE SET v.hiragana = "いぬ", v.english = "Dog";

MERGE (v:Vocabulary {japanese: "食べる"})
ON CREATE SET v.hiragana = "たべる", v.english = "To eat";

MERGE (v:Vocabulary {japanese: "寝る"})
ON CREATE SET v.hiragana = "ねる", v.english = "To sleep";

MERGE (v:Vocabulary {japanese: "旅行"})
ON CREATE SET v.hiragana = "りょこう", v.english = "Travel";
