import { is_opr_eq } from "../../predicates/is_opr_eq";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { BCons } from "./BCons";
import { is_binop } from "./is_binop";

export function is_opr_2_any_any(name: Sym): (expr: Cons) => expr is BCons<Sym, U, U> {
    return function (expr: Cons): expr is BCons<Sym, U, U> {
        return is_opr_eq(expr, name) && is_binop(expr);
    };
}