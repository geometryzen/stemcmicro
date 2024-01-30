/* eslint-disable no-console */
import { create_sym, Sym } from "math-expression-atoms";
import { Cons, nil, U } from "math-expression-tree";
import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF, TFLAG_HALT } from "../../env/ExtensionEnv";
import { hash_nonop_cons } from "../../hashing/hash_info";
import { Cons1 } from "../helpers/Cons1";
import { Function1 } from "../helpers/Function1";
import { is_any } from "../helpers/is_any";
import { Cell, CellHost } from "./Cell";

class ReactiveHost implements CellHost {
    reset(from: U, to: U, atom: Cell): void {
        from.pos;
        to.pos;
        atom.id;
        // eslint-disable-next-line no-console
        console.log("CellHost.reset", "from", `${from}`, "to", `${to}`, "id", `${JSON.stringify(atom.id)}`);
    }
    deref(value: U, atom: Cell): void {
        value.pos;
        atom.id;
        console.log("CellHost.deref", "value", `${value}`, "id", `${JSON.stringify(atom.id)}`);
    }
}

const cellHost = new ReactiveHost();

type ARG = U;
type EXP = Cons1<Sym, ARG>;

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        const ATOM = create_sym("atom");
        try {
            return new Op($, ATOM);
        }
        finally {
            ATOM.release();
        }
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function Eval_atom(expr: Cons, $: ExtensionEnv): U {
    const arg = expr.arg;
    try {
        const value = $.valueOf(arg);
        try {
            return new Cell(value, cellHost);
        }
        finally {
            value.release();
        }
    }
    finally {
        arg.release();
    }
    return nil;
}

class Op extends Function1<ARG> implements Operator<EXP> {
    readonly #hash: string;
    constructor($: ExtensionEnv, ATOM: Sym) {
        super('atom', ATOM, is_any, $);
        this.#hash = hash_nonop_cons(this.opr);
    }
    get hash(): string {
        return this.#hash;
    }
    transform(expr: Cons): [number, U] {
        const $ = this.$;
        const retval = Eval_atom(expr, $);
        const changed = !retval.equals(expr);
        return [changed ? TFLAG_DIFF : TFLAG_HALT, retval];
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, arg: ARG, expr: Cons1<Sym, ARG>): [TFLAGS, U] {
        throw new Error("TODO");
    }
}

export const atom_builder = new Builder();
