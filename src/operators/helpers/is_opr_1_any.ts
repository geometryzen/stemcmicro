import { is_opr_eq } from "../../predicates/is_opr_eq";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { is_unaop } from "./is_unaop";
import { UCons } from "./UCons";

export function is_opr_1_any(name: Sym): (expr: Cons) => expr is UCons<Sym, U> {
    return function (expr: Cons): expr is UCons<Sym, U> {
        return is_opr_eq(expr, name) && is_unaop(expr);
    };
}