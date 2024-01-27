import { U } from 'math-expression-tree';
import { Err } from "../../tree/err/Err";
import { assert_U } from "../helpers/is_any";

export function is_err(expr: unknown): expr is Err {
    assert_U(expr, "is_err(expr)", "expr");
    return expr instanceof Err;
}

export function assert_err(expr: U, context?: string, argName?: string): Err {
    if (is_err(expr)) {
        return expr;
    }
    else {
        if (typeof context === 'string') {
            // TODO: This should be a reusable message for consistency.
            throw new Error(`${context}: Expecting ${argName} to be a Err but got ${expr}.`);
        }
        else {
            throw new Error("Expecting Err");
        }
    }
}
