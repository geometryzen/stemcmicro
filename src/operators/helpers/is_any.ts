import { U } from "math-expression-tree";

/**
 * This is used as a type guard.
 * From the typing standpoint it does not add any value.
 * However, from an implementation standpoint it protects against programming errors.
 * undefined, null, and anything that doesn't look like a U causes an exception.
 */
export function is_any(expr: U): expr is U {
    assert_U(expr, "is_any(expr)", "expr");
    return true;
}

/**
 * 
 * @param expr The expression being asserted.
 * @param context The context e.g. "foo(a,b)"
 * @param argName The argument name in the context e.g. "a" or "b". 
 * @returns 
 */
export function assert_U(expr: unknown, context: string, argName: string): U {
    if (typeof expr === 'undefined' || expr === null) {
        throw new Error(`${context}: Expecting ${argName} to be a U but got ${expr}.`);
    }
    const duck = expr as U;
    if (duck.isCons()) {
        return duck;
    }
    else if (duck.isNil()) {
        return duck;
    }
    else {
        return duck;
    }
}