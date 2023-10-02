// https://chat.openai.com/share/bad7dc23-ac9e-484b-a0a9-3be2a477db5d
class SRSItem < T > {
    element: T;
    level: number;
    lastSeen: Date;

    constructor(element: T) {
        this.element = element;
        this.level = 0;
        this.lastSeen = new Date(0); // Initialize to epoch
    }

    toString(): string {
        return `SRSItem { element: ${this.element}, level: ${this.level}, lastSeen: ${this.lastSeen} }`;
    }
}

class SRS < T > {
    items: SRSItem < T > [];

    constructor(elements: T[]) {
        if (elements.length === 0) {
            throw new Error('Elements cannot be an empty list.');
        }
        this.items = elements.map((element) => new SRSItem(element));
    }

    private levelDelays = [
        0,  // level 0: 0 second delay, not started.
        15 * 1000, // level 1: 15 second delay
        1 * 60 * 1000, // level 2: 1 minute second delay
        5 * 60 * 1000, // level 3: 5 minute delay
        60 * 60 * 1000 // level 4: 60 minute delay
    ];

    getNextElement(): T {
        const now = new Date();
        const eligibleItems = this.items.filter(item => now.getTime() >= item.lastSeen.getTime() + this.levelDelays[item.level]);
        console.log('Eligible items length ' + eligibleItems.length);
        // No elements need testing, get a random one.
        if (eligibleItems.length === 0) {
            const randomNumber = Math.floor(Math.random() * this.items.length);
            return this.items[randomNumber].element;
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
        return eligibleItems[0].element;
    }

    processFeedback(element: T, success: boolean): void {
        const item = this.items.find((item) => item.element === element);
        if (!item) {
            throw new Error("Element not found in the SRS list.");
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

export default SRS;