import { TFLAG_DIFF, ExtensionEnv, NOFLAGS, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, is_nil, makeList, U } from "../../tree/tree";
import { FunctionVarArgs } from "../helpers/FunctionVarArgs";
import { is_sym } from "../sym/is_sym";
import { MATH_DERIVATIVE } from "./MATH_DERIVATIVE";

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
        if (is_cons(expr) && is_opr(this.opr, expr)) {
            const $ = this.$;
            if (is_nil($.getBinding(this.opr))) {
                const retval = makeList(this.oprNew, ...expr.tail());
                return [TFLAG_DIFF, $.valueOf(retval)];
            }
            else {
                return [NOFLAGS, expr];
            }
        }
        return [NOFLAGS, expr];
    }
}

export const d_to_derivative = new Builder(`d_to_derivative`, new Sym('d'), MATH_DERIVATIVE); 
