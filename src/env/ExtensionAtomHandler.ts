import { Sym } from "math-expression-atoms";
import { AtomHandler, ExprContext } from "math-expression-context";
import { Atom } from "math-expression-tree";

export class ExtensionAtomHandler implements AtomHandler<Atom> {
    constructor() {

    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    test(atom: Atom, opr: Sym, env: ExprContext): boolean {
        throw new Error("Method not implemented.");
    }
}