import { SRSItem } from "../lib/srs"

export default class Translation extends SRSItem {
    targetCharacterSet: String;
    japanese: String;
    hiragana: String;
    english: String;

    constructor(id: string, level: number, lastSeen: Date, targetCharacterSet: String, japanese: String, hiragana: String, english: String) {
        super(id, level, lastSeen);
        this.targetCharacterSet = targetCharacterSet;
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
          Target Character Set: ${this.targetCharacterSet},
          Requirements: 
          ${requirementsString}
        }`;
      }
      
}
