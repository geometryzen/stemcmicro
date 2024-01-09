import { Atom } from "math-expression-atoms";
import { U } from "math-expression-tree";

export class Hyp extends Atom {
    constructor(public readonly printname: string, pos?: number, end?: number) {
        super('Hyp', pos, end);
    }
    override equals(other: U): boolean {
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
    override toString(): string {
        return `${this.name}()`;
    }
}

export function create_hyp(printname: string): Hyp {
    return new Hyp(printname);
}

export const epsilon = new Hyp('ε');
export const delta = new Hyp('δ');
