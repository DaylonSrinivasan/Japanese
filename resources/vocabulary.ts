import { DateTime } from "neo4j-driver";

export default class Vocabulary {
    japanese: String;
    hiragana: String;
    english: String;
    level: number;
    lastSeen: DateTime;

    constructor(japanese: String, hiragana: String, english: String, level: number, lastSeen: DateTime) {
        this.japanese = japanese;
        this.hiragana = hiragana;
        this.english = english;
        this.level = level;
        this.lastSeen = lastSeen;
    }

    toString(): string {
        return `Vocabulary { english: ${this.english}, level: ${this.level}, lastSeen: ${this.lastSeen} }`;
    }
}
