import { create_sym, is_sym, Sym } from "math-expression-atoms";
import { nil, U } from "math-expression-tree";
import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { Function1 } from "../helpers/Function1";
import { Cons1 } from "../helpers/Cons1";
import { extract_def_args } from "./extract_def_args";

/**
 * TODO: We need this in the Native arsenal?
 */
const DEF = create_sym("def");

type ARG = Sym;
type EXP = Cons1<Sym, ARG>;

/**
 * (def symbol doc-string? init?)
 * [symbol]
 * [symbol init]
 * [symbol doc-string init]
 * @param expr 
 * @param $ 
 * @returns 
 */
function Eval_def_sym(expr: EXP, $: ExtensionEnv): U {
    const argList = expr.argList;
    const [sym, doc, init] = extract_def_args(expr);
    try {
        return def_sym_init(sym, $);
    }
    finally {
        argList.release();
        sym.release();
        doc.release();
        init.release();
    }

}

/**
 * (def symbol)
 */
function def_sym_init(sym: Sym, $: ExtensionEnv): U {
    $.setBinding(sym, nil);
    return nil;
}

class Op extends Function1<ARG> implements Operator<EXP> {
    constructor($: ExtensionEnv) {
        super('def [symbol]', DEF, is_sym, $);
    }
    valueOf(expr: EXP): U {
        return Eval_def_sym(expr, this.$);
    }
    transform1(opr: Sym, arg: ARG, orig: EXP): [TFLAGS, U] {
        const retval = Eval_def_sym(orig, this.$);
        return [TFLAG_DIFF, retval];
    }
}

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

/**
 * (def symbol)
 */
export const def_sym_builder = new Builder();
