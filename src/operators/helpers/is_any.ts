import { U } from "math-expression-tree";

/**
 * This is used as a type guard.
 * From the typing standpoint it does not add any value.
 * However, from an implementation standpoint it protects against programming errors.
 * undefined, null, and anything that doesn't look like a U causes an exception.
 */
export function is_any(expr: U): expr is U {
    assert_any(expr);
    return true;
}

export function assert_any(expr: unknown): U {
    if (typeof expr === 'undefined') {
        throw new Error(`Expecting expr to be a U but got ${expr}.`);
    }
    else if (expr === null) {
        throw new Error(`Expecting expr to be a U but got ${expr}.`);
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