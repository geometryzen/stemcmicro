import { U } from "../../tree/tree";

export function is_any(expr: U): expr is U {
    if (typeof expr === 'undefined') {
        throw new Error();
    }
    return true;
}