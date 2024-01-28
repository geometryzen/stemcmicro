import { create_sym, is_sym, Str, Sym } from "math-expression-atoms";
import { nil, U } from "math-expression-tree";
import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { Err } from "../../tree/err/Err";
import { Cons2 } from "../helpers/Cons2";
import { Function2 } from "../helpers/Function2";
import { is_any } from "../helpers/is_any";
import { extract_def_args } from "./extract_def_args";

/**
 * TODO: We need this in the Native arsenal?
 */
const DEF = create_sym("def");

type LHS = Sym;
type RHS = U;
type EXP = Cons2<Sym, LHS, RHS>;

/**
 * (def symbol doc-string? init?)
 * [symbol]
 * [symbol init]
 * [symbol doc-string init]
 * @param expr 
 * @param $ 
 * @returns 
 */
function Eval_def_sym_init(expr: EXP, $: ExtensionEnv): U {
    const argList = expr.argList;
    const [sym, doc, init] = extract_def_args(expr);
    try {
        const binding = $.valueOf(init);
        try {
            return def_sym_init(sym, binding, $);
        }
        finally {
            binding.release();
        }
    }
    finally {
        argList.release();
        sym.release();
        doc.release();
        init.release();
    }

}

function def_sym_init(sym: Sym, init: U, $: ExtensionEnv): U {
    if (is_sym(sym)) {
        $.setBinding(sym, init);
        return nil;
    }
    else {
        return new Err(new Str("First argument to def must be a symbol."));
    }
}

class Op extends Function2<LHS, RHS> implements Operator<EXP> {
    constructor($: ExtensionEnv) {
        super('def [symbol init]', DEF, is_sym, is_any, $);
    }
    valueOf(expr: EXP): U {
        return Eval_def_sym_init(expr, this.$);
    }
    override transform(expr: EXP): [TFLAGS, U] {
        // We override the transform method because (def ...) is a special form.
        // If we don't we run into troble because we attempt to evaluate the symbol. 
        const retval = Eval_def_sym_init(expr, this.$);
        return [TFLAG_DIFF, retval];
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform2(opr: Sym, lhs: LHS, rhs: RHS, orig: EXP): [TFLAGS, U] {
        // This should not be called because of the override.
        // TODO: This suggests that we need a different base abstraction.
        throw new Error();
    }
}

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

/**
 * (def symbol init)
 */
export const def_sym_init_builder = new Builder();
