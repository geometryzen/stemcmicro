import { U } from "math-expression-tree";

/**
 * The parser requires a mutable for our Cons.
 */
export class Pair implements U {
    constructor(
        public car: U,
        public cdr: U
    ) {}
    addRef(): void {}
    release(): void {}
    name = "Pair";
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    contains(needle: U): boolean {
        throw new Error("Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    equals(other: U): boolean {
        throw new Error("Method not implemented.");
    }
    get iscons(): boolean {
        throw new Error("Method not implemented.");
    }
    get isnil(): boolean {
        throw new Error("Method not implemented.");
    }
    toString(): string {
        return `Pair(${this.car} ${this.cdr})`;
    }
    pos?: number | undefined;
    end?: number | undefined;
}
