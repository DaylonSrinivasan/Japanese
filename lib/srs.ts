// https://chat.openai.com/share/bad7dc23-ac9e-484b-a0a9-3be2a477db5d
export abstract class SRSItem {

    constructor(public level: number, public lastSeen: Date) {
        this.level = level;
        this.lastSeen = lastSeen;
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

    private levelDelays = [
        0,  // level 0: 0 second delay, not started.
        15 * 1000, // level 1: 15 second delay
        1 * 60 * 1000, // level 2: 1 minute second delay
        5 * 60 * 1000, // level 3: 5 minute delay
        60 * 60 * 1000 // level 4: 60 minute delay
    ];

    getNext(): SRSItem {
        const now = new Date();
        const eligibleItems = this._items.filter(item => now.getTime() >= item.lastSeen.getTime() + this.levelDelays[item.level]);
        console.log('Eligible items length ' + eligibleItems.length);
        // No elements need testing, get a random one.
        if (eligibleItems.length === 0) {
            const randomNumber = Math.floor(Math.random() * this._items.length);
            return this._items[randomNumber];
        }
        eligibleItems.sort((a, b) => {
            // Sort by highest level first
            if (a.level !== b.level) {
                return b.level - a.level;
            } else {
                // If the levels are the same, sort by oldest lastSeen time
                return a.lastSeen.getTime() - b.lastSeen.getTime();
            }
        });
        return eligibleItems[0];
    }

    processFeedback(item: SRSItem, success: boolean): void {
        if (!this._items.includes(item)) {
            throw new Error("Item not found in the SRS list.");
        }
        item.level = Math.max(item.level, 1); // This item has been seen, so it will be at least level 1.
        item.lastSeen = new Date();
        if (success) {
            item.level = Math.min(item.level + 1, this.levelDelays.length - 1);
        } else {
            item.level = 1;
        }
    }
}