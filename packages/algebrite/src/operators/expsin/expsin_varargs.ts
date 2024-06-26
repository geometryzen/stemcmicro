import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, TFLAG_DIFF, TFLAG_HALT, TFLAG_NONE } from "../../env/ExtensionEnv";
import { hash_nonop_cons } from "@stemcmicro/hashing";
import { Native } from "@stemcmicro/native";
import { native_sym } from "@stemcmicro/native";
import { cadr } from "../../tree/helpers";
import { Cons, U } from "../../tree/tree";
import { FunctionVarArgs } from "../helpers/FunctionVarArgs";
import { expsin } from "./expsin";

export const EXPSIN = native_sym(Native.expsin);

class Op extends FunctionVarArgs<Cons> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super("expsin", EXPSIN);
        this.#hash = hash_nonop_cons(this.opr);
    }
    get hash(): string {
        return this.#hash;
    }
    transform(expr: Cons, $: ExtensionEnv): [number, U] {
        if ($.isExpanding()) {
            const arg = $.valueOf(cadr(expr));
            const retval = expsin(arg, $);
            const changed = !retval.equals(expr);
            return [changed ? TFLAG_DIFF : TFLAG_HALT, retval];
        } else {
            return [TFLAG_NONE, expr];
        }
    }
}

export const expsin_varargs = mkbuilder(Op);
