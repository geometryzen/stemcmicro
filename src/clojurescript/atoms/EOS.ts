import { U } from "math-expression-tree";

export class EOS implements U {
    addRef(): void {
    }
    release(): void {
    }
    name = "EOS";
    constructor() {

    }
    contains(needle: U): boolean {
        return needle instanceof EOS;
    }
    equals(other: U): boolean {
        return other instanceof EOS;
    }
    get iscons(): boolean {
        return false;
    }
    get isnil(): boolean {
        return false;
    }
    pos?: number | undefined;
    end?: number | undefined;
}
