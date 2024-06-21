import { is_sym, Sym } from "@stemcmicro/atoms";
import { ExprContext } from "@stemcmicro/context";
import { Native, native_sym } from "@stemcmicro/native";
import { caadr, caddr, cadr, car, cdadr, Cons, Cons2, items_to_cons, nil, U } from "@stemcmicro/tree";

const EVAL = native_sym(Native.eval);
const FUNCTION = native_sym(Native.function);

// Store a function definition
//
// Example:
//
//      f(x,y) = x^y or f paramList = body
//
// For this definition, assignExpr points to the following structure.
//
//     assignExpr
//      |
//   ___v__    ______                        ______
//  |CONS  |->|CONS  |--------------------->|CONS  |
//  |______|  |______|                      |______|
//      |         |                             |
//   ___v__    ___v__    ______    ______    ___v__    ______    ______
//  |SETQ  |  |CONS  |->|CONS  |->|CONS  |  |CONS  |->|CONS  |->|CONS  |
//  |______|  |______|  |______|  |______|  |______|  |______|  |______|
//                |         |         |         |         |         |
//             ___v__    ___v__    ___v__    ___v__    ___v__    ___v__
//            |SYM f |  |SYM x |  |SYM y |  |POWER |  |SYM x |  |SYM y |
//            |______|  |______|  |______|  |______|  |______|  |______|
//
// the result (in f) is a FUNCTION node
// that contains both the body and the argument list.
//
// We have
//
//  caadr(p1) points to the function name i.e. f
//  cdadr(p1) points to the arguments i.e. the list (x y)
//  caddr(p1) points to the function body i.e. (pow x y)
// F function name
// A argument list
// B function body
/**
 * The assignment is converted info a binding of f to (function body argList).
 *
 * @param assignExpr (= (f paramList) body)
 * @returns nil
 */
export function define_function(assignExpr: Cons2<Sym, U, U>, $: Pick<ExprContext, "setBinding" | "valueOf">): Cons {
    /**
     * The function name.
     */
    const F = caadr(assignExpr);
    /**
     * The parameter list.
     */
    const paramList = cdadr(assignExpr);
    /**
     * The function body.
     */
    let body = caddr(assignExpr);

    // console.lg(`F => ${F}`);
    // console.lg(`A => ${A}`);
    // console.lg(`B => ${B}`);

    if (!is_sym(F)) {
        throw new Error("function name?");
    }

    // evaluate function body (maybe), only if it is surrounded by

    if (car(body).equals(EVAL)) {
        body = $.valueOf(cadr(body));
    }

    // note how, unless explicitly forced by an eval,
    // (handled by the if just above)
    // we don't eval/simplify
    // the body.
    // Why? because it's the easiest way
    // to solve scope problems i.e.
    //   x = 0
    //   f(x) = x + 1
    //   f(4) # would reply 1
    // which would need to otherwise
    // be solved by some scope device
    // somehow
    const functionExpr = items_to_cons(FUNCTION, body, paramList);

    $.setBinding(F, functionExpr);

    return nil;
}
