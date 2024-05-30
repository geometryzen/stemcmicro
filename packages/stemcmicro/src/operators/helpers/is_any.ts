import { U } from "@stemcmicro/tree";

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

export function assert_U(expr: unknown, context: string, argName: string): U | never {
    if (typeof expr === "undefined" || expr === null) {
        throw new Error(`${context}: Expecting ${argName} to be a U but got ${expr}.`);
    }
    const duck = expr as U;
    if (duck.iscons) {
        return duck;
    } else if (duck.isnil) {
        return duck;
    } else {
        return duck;
    }
}
