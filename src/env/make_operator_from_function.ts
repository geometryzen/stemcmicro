import { hash_nonop_cons } from "../hashing/hash_info";
import { FunctionVarArgs } from "../operators/helpers/FunctionVarArgs";
import { create_sym } from "../tree/sym/Sym";
import { Cons, U } from "../tree/tree";
import { ExtensionEnv, Operator, OperatorBuilder, TFLAG_DIFF, TFLAG_NONE } from "./ExtensionEnv";

class Builder implements OperatorBuilder<U> {
    constructor(private readonly name: string, private readonly evaluator: (expr: Cons, $: ExtensionEnv) => U) {
    }
    create($: ExtensionEnv): Operator<U> {
        return new Op(this.name, this.evaluator, $);
    }
}

class Op extends FunctionVarArgs implements Operator<Cons> {
    readonly hash: string;
    constructor(name: string, private readonly evaluator: (expr: Cons, $: ExtensionEnv) => U, $: ExtensionEnv) {
        super(name, create_sym(name), $);
        this.hash = hash_nonop_cons(this.opr);
    }
    transform(expr: Cons): [number, U] {
        const $ = this.$;
        const retval = this.evaluator(expr, $);
        const flags = retval.equals(expr) ? TFLAG_NONE : TFLAG_DIFF;
        return [flags, retval];
    }
}

/**
 * 
 * @param name The name of the operator. This is used to construct a symbol.
 * @param evaluator The implementation of the operator.
 * @returns 
 */
export function make_operator_from_evaluator(name: string, evaluator: (expr: Cons, $: ExtensionEnv) => U) {
    return new Builder(name, evaluator);
}
