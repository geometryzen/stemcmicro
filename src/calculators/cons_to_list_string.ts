import { ExtensionEnv } from "../env/ExtensionEnv";
import { Cons, is_cons, NIL } from "../tree/tree";
import { to_list_string } from "./to_list_string";

export function cons_to_list_string(cons: Cons, $: ExtensionEnv): string {
    let str = '';
    str += '(';
    str += to_list_string(cons.car, $);
    let expr = cons.cdr;
    while (is_cons(expr)) {
        str += ' ';
        str += to_list_string(expr.car, $);
        expr = expr.cdr;
    }
    if (expr !== NIL) {
        str += ' . ';
        str += to_list_string(expr, $);
    }
    str += ')';
    return str;
}