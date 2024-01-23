import { Atom } from "math-expression-atoms";
import { U } from "math-expression-tree";

export class Map extends Atom {
    /**
     * TODO: Change to entries: [key:U value:U][]
     * @param entries
     * @param pos
     * @param end 
     */
    constructor(readonly entries: [key: U, value: U][], pos?: number, end?: number) {
        super('Map', pos, end);
    }
    toString(): string {
        function entryToString(entry: [key: U, value: U]): string {
            return entry.map(part => part.toString()).join(' ');
        }
        return `{${this.entries.map(entry => entryToString(entry)).join(' ')}}`;
    }
}

export function is_map(x: unknown): x is Map {
    return x instanceof Map;
}