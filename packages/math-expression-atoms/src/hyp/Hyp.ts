import { U } from "math-expression-tree";
import { JsAtom } from "../atom/JsAtom";

export class Hyp extends JsAtom {
    readonly type = "hyperreal";
    constructor(
        public readonly printname: string,
        pos?: number,
        end?: number
    ) {
        super("Hyp", pos, end);
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

export function is_hyp(expr: U): expr is Hyp {
    return expr instanceof Hyp;
}

export function assert_hyp(expr: U): Hyp | never {
    if (is_hyp(expr)) {
        return expr;
    } else {
        // Don't need anything fancy here because this is an assertion for dev eyes only.
        throw new Error(`Expecting a Hyp but got expression ${expr}.`);
    }
}

export const epsilon = new Hyp("ε");
export const delta = new Hyp("δ");
