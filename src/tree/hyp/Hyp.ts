import { Atom } from "../atom/Atom";
import { U } from "../tree";

export class Hyp extends Atom<'Hyp'> {
    constructor(public readonly printname: string, pos?: number, end?: number) {
        super('Hyp', pos, end);
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
    toInfixString(): string {
        throw new Error("Hyp Method not implemented.");
    }
    toListString(): string {
        throw new Error("Hyp Method not implemented.");
    }
    toString(): string {
        return `${this.name}()`;
    }
}

export function create_hyp(printname: string): Hyp {
    return new Hyp(printname);
}

export const epsilon = new Hyp('ε');
export const delta = new Hyp('δ');
