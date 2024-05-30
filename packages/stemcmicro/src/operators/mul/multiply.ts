import { Sym } from "@stemcmicro/atoms";
import { Native, native_sym } from "@stemcmicro/native";
import { items_to_cons, U } from "@stemcmicro/tree";
import { Cons2 } from "../helpers/Cons2";

export function multiply<LHS extends U, RHS extends U>(lhs: LHS, rhs: RHS): Cons2<Sym, LHS, RHS> {
    return items_to_cons(native_sym(Native.multiply), lhs, rhs) as Cons2<Sym, LHS, RHS>;
}
