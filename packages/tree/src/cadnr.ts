import { Cons, is_cons, U } from "./tree";

/**
 * Extracts the operand at the specified zero-based position, where expr = (op0 op1 op2 ...).
 * cad(n)r foo = cad(n-1)r cdr foo and cad(0)r foo = car foo
 * @param expr A Cons expression for which the nth operand is sought.
 * @param n The zero-base operand index. MUST be an integer >= 0.
 */
export function cadnr(expr: Cons, n: number): U {
    if (n > 0) {
        const argList = expr.argList;
        if (is_cons(argList)) {
            return cadnr(argList, n - 1);
        } else {
            return argList;
        }
    } else {
        return expr.car;
    }
}
