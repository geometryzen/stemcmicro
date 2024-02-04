import { Sym } from "math-expression-atoms";
import { Native, native_sym } from "math-expression-native";
import { items_to_cons, U } from "math-expression-tree";
import { Cons2 } from "../helpers/Cons2";

export function add<LHS extends U, RHS extends U>(lhs: LHS, rhs: RHS): Cons2<Sym, LHS, RHS> {
    return items_to_cons(native_sym(Native.add), lhs, rhs) as Cons2<Sym, LHS, RHS>;
}