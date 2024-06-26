import { Native, native_sym } from "@stemcmicro/native";
import { Cons, U } from "@stemcmicro/tree";
import { ExtensionEnv, mkbuilder, TFLAG_DIFF, TFLAG_HALT } from "../../env/ExtensionEnv";
import { hash_nonop_cons } from "@stemcmicro/hashing";
import { FunctionVarArgs } from "../helpers/FunctionVarArgs";
import { eval_let } from "./eval_let";

const LET = native_sym(Native.let);

class Op extends FunctionVarArgs<Cons> {
    readonly #hash: string;
    constructor() {
        super("(let [binding*] body)", LET);
        this.#hash = hash_nonop_cons(this.opr);
    }
    get hash(): string {
        return this.#hash;
    }
    transform(expr: Cons, $: ExtensionEnv): [number, U] {
        const retval = eval_let(expr, $);
        const changed = !retval.equals(expr);
        return [changed ? TFLAG_DIFF : TFLAG_HALT, retval];
    }
}

export const let_varargs = mkbuilder<Cons>(Op);
