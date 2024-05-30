import { Cell, Sym } from "@stemcmicro/atoms";
import { Native, native_sym } from "@stemcmicro/native";
import { Cons, Cons1, nil, U } from "@stemcmicro/tree";
import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, TFLAGS, TFLAG_DIFF, TFLAG_HALT } from "../../env/ExtensionEnv";
import { hash_nonop_cons } from "../../hashing/hash_info";
import { Function1 } from "../helpers/Function1";
import { is_any } from "../helpers/is_any";

type ARG = U;
type EXP = Cons1<Sym, ARG>;

function eval_atom(expr: Cons, $: ExtensionEnv): U {
    const arg = expr.arg;
    try {
        const value = $.valueOf(arg);
        try {
            return new Cell(value, $.getCellHost());
        } finally {
            value.release();
        }
    } finally {
        arg.release();
    }
    return nil;
}

class Op extends Function1<ARG> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super("atom", native_sym(Native.atom), is_any);
        this.#hash = hash_nonop_cons(this.opr);
    }
    get hash(): string {
        return this.#hash;
    }
    transform(expr: Cons, $: ExtensionEnv): [number, U] {
        const retval = eval_atom(expr, $);
        const changed = !retval.equals(expr);
        return [changed ? TFLAG_DIFF : TFLAG_HALT, retval];
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, arg: ARG, expr: Cons1<Sym, ARG>): [TFLAGS, U] {
        throw new Error("TODO");
    }
}

export const atom_builder = mkbuilder<EXP>(Op);
