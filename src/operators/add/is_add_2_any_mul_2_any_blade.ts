import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, U } from "../../tree/tree";
import { Blade } from "../../tree/vec/Blade";
import { BCons } from "../helpers/BCons";
import { is_any } from "../helpers/is_any";
import { is_mul_2_any_blade } from "../mul/is_mul_2_any_blade";
import { is_add_2_any_any } from "./is_add_2_any_any";

type LHS = U;
type RHS = BCons<Sym, U, Blade>;
type EXPR = BCons<Sym, LHS, RHS>;

export function is_add_2_any_mul_2_any_blade(expr: Cons): expr is EXPR {
    if (is_add_2_any_any(expr)) {
        const lhs = expr.lhs;
        const rhs = expr.rhs;
        return is_any(lhs) && is_cons(rhs) && is_mul_2_any_blade(rhs);
    }
    else {
        return false;
    }
}