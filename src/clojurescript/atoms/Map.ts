import { Atom } from "math-expression-atoms";
import { U } from "math-expression-tree";

export class Map extends Atom {
    /**
     * TODO: Change to entries: [key:U value:U][]
     * @param elements
     * @param pos
     * @param end 
     */
    constructor(readonly elements: U[], pos?: number, end?: number) {
        super('Map', pos, end);
    }
    toString(): string {
        // This is only for debugging.
        return `{${this.elements.map((element) => element.toString()).join(' ')}}`;
    }
}

export function is_map(x: unknown): x is Map {
    return x instanceof Map;
}