import { create_sym, is_sym, Sym } from "math-expression-atoms";
import { Native, native_sym } from "math-expression-native";
import { Cons, is_cons, items_to_cons, U } from "math-expression-tree";
import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { FunctionVarArgs } from "../helpers/FunctionVarArgs";

class Builder implements OperatorBuilder<Cons> {
    constructor(private readonly name: string, private readonly opr: Sym, private readonly oprNew: Sym) {

    }
    create($: ExtensionEnv): Operator<Cons> {
        return new Op(this.name, this.opr, this.oprNew, $);
    }
}

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
class Op extends FunctionVarArgs implements Operator<Cons> {
    constructor(name: string, oprOld: Sym, private readonly oprNew: Sym, $: ExtensionEnv) {
        super(name, oprOld, $);
    }
    transform(expr: U): [TFLAGS, U] {
        // console.lg(this.name, `${expr}`);
        if (is_cons(expr) && is_opr(this.opr, expr)) {
            const $ = this.$;
            const retval = items_to_cons(this.oprNew, ...expr.tail());
            return [TFLAG_DIFF, $.valueOf(retval)];
        }
        return [TFLAG_NONE, expr];
    }
}

export const d_to_derivative_builder = new Builder(`d_to_derivative`, create_sym('d'), native_sym(Native.derivative)); 
