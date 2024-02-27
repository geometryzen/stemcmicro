import { Shareable } from "math-expression-tree";
import { ProgrammingError } from "../programming/ProgrammingError";

export class ShareableMap<K, V extends Shareable> implements Shareable {
    #map: Map<K, V> = new Map();
    #refCount = 1;
    constructor() {
        // Nothing to see here.
    }
    has(key: K): boolean {
        return this.#map.has(key);
    }
    get(key: K): V {
        if (this.#map.has(key)) {
            const value = this.#map.get(key)!;
            value.addRef();
            return value;
        }
        else {
            throw new ProgrammingError();
        }
    }
    set(key: K, value: V): void {
        value.addRef();
        this.#map.set(key, value);
    }
    addRef(): void {
        this.#refCount++;
    }
    release(): void {
        this.#refCount--;
        if (this.#refCount === 0) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            for (const [key, value] of this.#map.entries()) {
                value.release();
            }
        }
    }

}