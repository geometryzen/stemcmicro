import { assert_sym, create_sym, is_sym, Str, Sym } from "math-expression-atoms";
import { nil, U } from "math-expression-tree";
import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { Err } from "../../tree/err/Err";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { is_any } from "../helpers/is_any";

/**
 * TODO: We need this in the Native arsenal?
 */
const DEF = create_sym("def");

type LHS = U;
type RHS = U;
type EXP = BCons<Sym, LHS, RHS>;

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
        super('def [symbol init]', DEF, is_any, is_any, $);
    }
    valueOf(expr: EXP): U {
        return Eval_def_sym_init(expr, this.$);
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS, orig: EXP): [TFLAGS, U] {
        const retval = Eval_def_sym_init(orig, this.$);
        return [TFLAG_DIFF, retval];
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
