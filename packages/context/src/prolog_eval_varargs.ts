import { Cons, cons, U } from "@stemcmicro/tree";
import { ExprContext } from "./ExprContext";

/**
 * The correct way to handle eval functions that respects the overloading of operators mechanism.
 */
export function prolog_eval_varargs(expr: Cons, handler: (values: Cons, env: ExprContext) => U, env: ExprContext) {
    const argList = expr.argList;
    try {
        const values = argList.map((arg) => env.valueOf(arg));
        try {
            const opr = expr.opr;
            const argList = expr.argList;
            try {
                if (values.equals(argList)) {
                    return handler(argList, env);
                } else {
                    // Evaluation of the arguments has produced changes so we give other operators a chance to evaluate.
                    const retval = cons(opr, values);
                    try {
                        return env.valueOf(retval);
                    } finally {
                        retval.release();
                    }
                }
            } finally {
                opr.release();
                argList.release();
            }
        } finally {
            values.release();
        }
    } finally {
        argList.release();
    }
}
