import { SRSItem } from "../lib/srs"

export default class Vocabulary extends SRSItem {
    japanese: String;
    hiragana: String;
    english: String;

    constructor(japanese: String, hiragana: String, english: String, level: number, lastSeen: Date) {
        super(level, lastSeen);
        this.japanese = japanese;
        this.hiragana = hiragana;
        this.english = english;
    }

    toString(): string {
        return `Vocabulary { english: ${this.english}, level: ${this.level}, lastSeen: ${this.lastSeen} }`;
    }
}
