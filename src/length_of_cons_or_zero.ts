import { is_cons, U } from "./tree/tree";

export function length_of_cons_otherwise_zero(expr: U): number {
    return is_cons(expr) ? [...expr].length : 0;
}
