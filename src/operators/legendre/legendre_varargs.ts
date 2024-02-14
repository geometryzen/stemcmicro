import { Cons, U } from "math-expression-tree";
import { ExtensionEnv, make_extension_builder, TFLAG_DIFF, TFLAG_HALT } from "../../env/ExtensionEnv";
import { hash_nonop_cons } from "../../hashing/hash_info";
import { LEGENDRE } from "../../runtime/constants";
import { FunctionVarArgs } from "../helpers/FunctionVarArgs";
import { eval_legendre } from "./legendre";

class Op extends FunctionVarArgs<Cons> {
    readonly #hash: string;
    constructor() {
        super('legendre', LEGENDRE);
        this.#hash = hash_nonop_cons(this.opr);
    }
    get hash(): string {
        return this.#hash;
    }
    transform(expr: Cons, $: ExtensionEnv): [number, U] {
        const retval = eval_legendre(expr, $);
        const changed = !retval.equals(expr);
        return [changed ? TFLAG_DIFF : TFLAG_HALT, retval];
    }
}

export const legendre_varargs = make_extension_builder(Op);
