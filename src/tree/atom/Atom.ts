import { U } from "../tree";

export abstract class Atom<NAME extends string> implements U {
    constructor(public readonly name: NAME, public readonly pos?: number, public readonly end?: number) {

    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    contains(needle: U): boolean {
        return this.equals(needle);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    equals(other: U): boolean {
        throw new Error(`Atom(name=${this.name}).equals(other=${other}) Method not implemented.`);
    }
    isCons(): boolean {
        return false;
    }
    isNil(): boolean {
        return false;
    }
}