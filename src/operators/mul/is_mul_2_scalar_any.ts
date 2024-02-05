import { Sym } from "math-expression-atoms";
import { Cons2, is_cons, U } from "math-expression-tree";
import { ExtensionEnv } from "../../env/ExtensionEnv";
import { is_scalar as make_is_scalar } from "../helpers/is_scalar";
import { is_mul_2_any_any } from "./is_mul_2_any_any";

export function is_mul_2_scalar_any($: ExtensionEnv): (expr: U) => expr is Cons2<Sym, U, U> {
    const is_scalar = make_is_scalar($);
    return function (expr: U): expr is Cons2<Sym, U, U> {
        return is_cons(expr) && is_mul_2_any_any(expr) && is_scalar(expr.lhs);
    };
}