import { hash_nonop_cons } from "../hashing/hash_info";
import { FunctionVarArgs } from "../operators/helpers/FunctionVarArgs";
import { Sym } from "../tree/sym/Sym";
import { Cons, U } from "../tree/tree";
import { ExtensionEnv, Operator, OperatorBuilder, TFLAG_DIFF, TFLAG_NONE } from "./ExtensionEnv";

class Builder implements OperatorBuilder<U> {
    constructor(private readonly opr: Sym, private readonly evaluator: (expr: Cons, $: ExtensionEnv) => U) {
    }
    create($: ExtensionEnv): Operator<U> {
        return new Op(this.opr, this.evaluator, $);
    }
}

class Op extends FunctionVarArgs implements Operator<Cons> {
    readonly hash: string;
    constructor(opr: Sym, private readonly evaluator: (expr: Cons, $: ExtensionEnv) => U, $: ExtensionEnv) {
        super(opr.text, opr, $);
        this.hash = hash_nonop_cons(this.opr);
    }
    transform(expr: Cons): [number, U] {
        const $ = this.$;
        // console.lg(this.name, render_as_sexpr(expr, $));
        const hook = (where: string, retval: U): U => {
            // console.lg("HOOK ....:", this.name, where, decodeMode($.getMode()), render_as_infix(expr, this.$), "=>", render_as_infix(retval, $));
            // console.lg("HOOK ....:", this.name, where, decodeMode($.getMode()), render_as_sexpr(expr, this.$), "=>", render_as_sexpr(retval, $));
            return retval;
        };
        const retval = this.evaluator(expr, $);
        const flags = retval.equals(expr) ? TFLAG_NONE : TFLAG_DIFF;
        return [flags, hook('', retval)];
    }
}

/**
 * 
 * @param name The name of the operator. This is used to construct a symbol.
 * @param evaluator The implementation of the operator.
 * @returns 
 */
export function make_operator_from_evaluator(opr: Sym, evaluator: (expr: Cons, $: ExtensionEnv) => U) {
    return new Builder(opr, evaluator);
}
