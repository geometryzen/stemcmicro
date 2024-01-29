import { assert_sym, Sym } from "math-expression-atoms";
import { Cons, nil, U } from "math-expression-tree";

/**
 * The top syntax doesn't tell you how the arguments get allocated.
 * (def symbol doc-string? init?)
 * The valid parameter lists are as follows
 * [symbol]
 * [symbol init]
 * [symbol doc-string init]
 */
export function extract_def_args(expr: Cons): [sym: Sym, doc: U, init: U] {
    const argList = expr.argList;
    try {
        switch (argList.length) {
            case 1: {
                return [assert_sym(argList.item(0)), nil, nil];
            }
            case 2: {
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
