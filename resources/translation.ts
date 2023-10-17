import { SRSItem } from "../lib/srs"

export default class Translation extends SRSItem {
    japanese: String;
    hiragana: String;
    english: String;

    constructor(id: string, level: number, lastSeen: Date, japanese: String, hiragana: String, english: String) {
        super(id, level, lastSeen);
        this.japanese = japanese;
        this.hiragana = hiragana;
        this.english = english;
    }

    toString(): string {
        const requirementsString = this.requirements.map((requirement) => {
          return `Requirement: id: ${requirement.id}, Level: ${requirement.level}`;
        }).join('\n');
        return `Translation { 
          Japanese: ${this.japanese}, 
          Current Level: ${this.level},
          Requirements: 
          ${requirementsString}
        }`;
      }
      
}
