import { create_sym, is_sym, Sym } from "math-expression-atoms";
import { Native, native_sym } from "math-expression-native";
import { Cons, is_cons, items_to_cons, U } from "math-expression-tree";
import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, make_extension_builder, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { FunctionVarArgs } from "../helpers/FunctionVarArgs";

export function is_opr(sym: Sym, expr: Cons): expr is Cons {
    const opr = expr.opr;
    if (is_sym(opr)) {
        return sym.equalsSym(opr);
    }
    else {
        return false;
    }
}

/**
 * (d t1 t2 t3 t4 ...) => (derivative t1 t2 t3 t4 ...), provided d is not bound
 */
class Op extends FunctionVarArgs<Cons> {
    constructor(readonly config: Readonly<EnvConfig>) {
        super('d-to-derivative', create_sym('d'));
    }
    transform(expr: U, $: ExtensionEnv): [TFLAGS, U] {
        // console.lg(this.name, `${expr}`);
        if (is_cons(expr) && is_opr(this.opr, expr)) {
            const retval = items_to_cons(native_sym(Native.derivative), ...expr.tail());
            return [TFLAG_DIFF, $.valueOf(retval)];
        }
        return [TFLAG_NONE, expr];
    }
}

export const d_to_derivative_builder = make_extension_builder<Cons>(Op); 
