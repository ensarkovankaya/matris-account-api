/**
 * Base Datasource class
 */
export class DataSource {
    /**
     * Generates partial data. Returns new object which have only given fields.
     * @param {object} obj
     * @param {string[]} fields
     * @return {Partial<T>}
     */
    public partial<T>(obj: object, fields: string[]): Partial<T> {
        const newObj = {};
        fields.forEach(field => newObj[field] = obj[field]);
        return newObj;
    }

    /**
     * Shuffles array in place.
     * @param {Array} array: Array containing the items.
     */
    public shuffle<T>(array: T[]): T[] {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    /**
     * Makes random choice from array
     * @param {any[]} choices
     * @return {any}
     */
    public choose<T>(choices: T[]): T {
        if (choices.length === 0) {
            throw new Error('Array is empty');
        }
        const index = Math.floor(Math.random() * choices.length);
        return choices[index];
    }
}
