import { assert_sym, create_sym, Sym } from "math-expression-atoms";
import { nil, U } from "math-expression-tree";
import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { Function1 } from "../helpers/Function1";
import { is_any } from "../helpers/is_any";
import { UCons } from "../helpers/UCons";

/**
 * TODO: We need this in the Native arsenal?
 */
const DEF = create_sym("def");

type ARG = U;
type EXP = UCons<Sym, ARG>;

/**
 * The top syntax doesn't tell you how the arguments get allocated.
 * (def symbol doc-string? init?)
 * The valid parameter lists are as follows
 * [symbol]
 * [symbol init]
 * [symbol doc-string init]
 */
function extract_def_args(expr: EXP): [sym: Sym, doc: U, init: U] {
    const argList = expr.argList;
    try {
        switch (argList.length) {
            case 1: {
                nil.addRef();
                nil.addRef();
                return [assert_sym(argList.item(0)), nil, nil];
            }
            case 2: {
                nil.addRef();
                return [assert_sym(argList.item(0)), nil, argList.item(1)];
            }
            case 3: {
                return [assert_sym(argList.item(0)), argList.item(1), argList.item(2)];
            }
            default: {
                throw new Error("Unexpected number of arguments for def Special Form.");
            }
        }
    }
    finally {
        argList.release();
    }
}

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
        super('def [symbol]', DEF, is_any, $);
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
