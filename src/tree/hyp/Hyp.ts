import { U } from "../tree";

export class Hyp implements U {
    readonly name = 'Hyp';
    constructor(public printname: string, public readonly pos?: number, public readonly end?: number) {
        // Nothing to see here.I
    }
    contains(needle: U): boolean {
        return this.equals(needle);
    }
    equals(other: U): boolean {
        if (other instanceof Hyp) {
            return this.equalsHyp(other);
        }
        return false;
    }
    equalsHyp(other: Hyp): boolean {
        if (this === other) {
            return true;
        }
        return this.printname === other.printname;
    }
    isCons(): boolean {
        return false;
    }
    isNil(): boolean {
        return false;
    }
    toCtorString(): string {
        return `${this.name}()`;
    }
    toInfixString(): string {
        throw new Error("Hyp Method not implemented.");
    }
    toListString(): string {
        throw new Error("Hyp Method not implemented.");
    }
}

export const epsilon = new Hyp('ε');
export const delta = new Hyp('δ');
