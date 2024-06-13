import { Sym } from "@stemcmicro/atoms";
import { Native, native_sym } from "@stemcmicro/native";
import { Cons2, items_to_cons, U } from "@stemcmicro/tree";

export function add<LHS extends U, RHS extends U>(lhs: LHS, rhs: RHS): Cons2<Sym, LHS, RHS> {
    return items_to_cons(native_sym(Native.add), lhs, rhs) as Cons2<Sym, LHS, RHS>;
}
