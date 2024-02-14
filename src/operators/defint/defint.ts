import { Cons, U } from "math-expression-tree";
import { ExtensionEnv, make_extension_builder, TFLAG_DIFF, TFLAG_HALT } from "../../env/ExtensionEnv";
import { hash_nonop_cons } from "../../hashing/hash_info";
import { DEFINT } from "../../runtime/constants";
import { FunctionVarArgs } from "../helpers/FunctionVarArgs";
import { eval_defint } from "./defint_helpers";

class Op extends FunctionVarArgs<Cons> {
    readonly #hash: string;
    constructor() {
        super('defint', DEFINT);
        this.#hash = hash_nonop_cons(this.opr);
    }
    get hash(): string {
        return this.#hash;
    }
    transform(expr: Cons, $: ExtensionEnv): [number, U] {
        const retval = eval_defint(expr, $);
        const changed = !retval.equals(expr);
        return [changed ? TFLAG_DIFF : TFLAG_HALT, retval];
    }
}

export const defint_builder = make_extension_builder(Op);
