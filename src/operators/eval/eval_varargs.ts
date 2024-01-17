import { ExtensionEnv, Operator, OperatorBuilder, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { hash_nonop_cons } from "../../hashing/hash_info";
import { EVAL } from "../../runtime/constants";
import { cadr, cddr } from "../../tree/helpers";
import { car, Cons, is_cons, U } from "../../tree/tree";
import { FunctionVarArgs } from "../helpers/FunctionVarArgs";
import { subst } from "../subst/subst";

/*
function Eval_Eval(p1: U, $: ExtensionEnv): U {
    let tmp = $.valueOf(cadr(p1));
    p1 = cddr(p1);
    while (is_cons(p1)) {
        tmp = subst(tmp, $.valueOf(car(p1)), $.valueOf(cadr(p1)), $);
        p1 = cddr(p1);
    }
    return $.valueOf(tmp);
}
*/

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

class Op extends FunctionVarArgs implements Operator<Cons> {
    readonly #hash: string;
    constructor($: ExtensionEnv) {
        super('eval', EVAL, $);
        this.#hash = hash_nonop_cons(this.opr);
    }
    get hash(): string {
        return this.#hash;
    }
    transform(expr: Cons): [number, U] {
        const $ = this.$;
        let p1: U = expr;
        let tmp = $.valueOf(cadr(p1));
        p1 = cddr(p1);
        while (is_cons(p1)) {
            const oldExpr = $.valueOf(car(p1));
            const newExpr = $.valueOf(cadr(p1));
            tmp = subst(tmp, oldExpr, newExpr, $);
            p1 = cddr(p1);
        }
        return [TFLAG_DIFF, $.valueOf(tmp)];
    }
}

export const eval_varargs = new Builder();
