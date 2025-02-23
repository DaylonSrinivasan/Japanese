export const LEVEL_DELAYS = [
    0,               // level 0: 0 second delay, not started.
    8 * 1000,       // level 1: 8 second delay
    1 * 60 * 1000,   // level 2: 1 minute delay
    5 * 60 * 1000,   // level 3: 5 minute delay
    60 * 60 * 1000,  // level 4: 60 minute delay
    6 * 60 * 60 * 1000,  // level 5: 3 hour delay
    24 * 60 * 60 * 1000, // level 6: 24 hour delay
    3 * 24 * 60 * 60 * 1000, // level 7: 3 day delay
    7 * 24 * 60 * 60 * 1000, // level 8: 7 day delay
    21 * 24 * 60 * 60 * 1000,  // level 9: 21 day delay
    90 * 24 * 60 * 60 * 1000,  // level 10: 90 day delay
];

// https://chat.openai.com/share/bad7dc23-ac9e-484b-a0a9-3be2a477db5d
export abstract class SRSItem {
    id: string;
    level: number;
    lastSeen: Date;
    requirements: SRSItem[] = []; // Items that must be learned before this item.

    constructor(id: string, level: number, lastSeen: Date) {
        this.id = id;
        this.level = level;
        this.lastSeen = lastSeen;
    }

    addRequirement(item: SRSItem) {
        this.requirements.push(item);
    }

    abstract toString(): string;
}

export class SRS {
    private _items: SRSItem[];
    constructor(items: SRSItem[]) {
        if (items.length === 0) {
            throw new Error('Elements cannot be an empty list.');
        }
        this._items = items;
    }

    get items(): SRSItem[] {
        return this._items;
    }

    set items(newItems: SRSItem[]) {
        if (newItems.length === 0) {
            throw new Error('Elements cannot be an empty list.');
        }
        this._items = newItems;
    }

    getNext(): SRSItem {
        const now = new Date();
        const eligibleItems = this._items.filter(item => {
            const levelDelay = LEVEL_DELAYS[item.level];

            // Check if the item itself is eligible based on its level and lastSeen
            const isTimeEligible = now.getTime() >= item.lastSeen.getTime() + levelDelay;

            // Check if all items in the "requirements" array are at least level 4
            const areRequirementsMet = item.requirements.every(req => req.level >= 4);

            // Return true if both conditions are met
            return isTimeEligible && areRequirementsMet;
          });

        console.log('Eligible items length ' + eligibleItems.length);
        // No elements need testing, get a random one.
        if (eligibleItems.length === 0) {
            const randomNumber = Math.floor(Math.random() * this._items.length);
            return this._items[randomNumber];
        }
        eligibleItems.sort((a, b) => {
            const inLearningPhase = (x: SRSItem) => {
                const now = new Date();
                const fifteenMinutesAgo = new Date(now.getTime() - 15 * 60 * 1000); // Calculate a date 15 minutes ago
                return x.level >= 1 && x.level <= 4 && x.lastSeen >= fifteenMinutesAgo;
            };
            const aInLearningPhase = inLearningPhase(a);
            const bInLearningPhase = inLearningPhase(b);
            if (aInLearningPhase && bInLearningPhase) {
                return b.lastSeen.getTime() - a.lastSeen.getTime();
            }
            else if (aInLearningPhase) {
                return -1;
            }
            else if (bInLearningPhase) {
                return 1;
            }
            else {
                const timeComparison = a.lastSeen.getTime() - b.lastSeen.getTime();
                const randomOffset = Math.random() * 0.000001;
                return timeComparison + randomOffset;
            }
        });
        console.log('The following item was chosen: ' + eligibleItems[0]);
        return eligibleItems[0];
    }

    processFeedback(item: SRSItem, success: boolean): void {
        if (!this._items.includes(item)) {
            throw new Error("Item not found in the SRS list.");
        }
        item.level = Math.max(item.level, 1); // This item has been seen, so it will be at least level 1.
        item.lastSeen = new Date();
        if (success) {
            item.level = Math.min(item.level + 1, LEVEL_DELAYS.length - 1);
        } else {
            item.level = Math.max(1, item.level - 2);
        }
    }
}
