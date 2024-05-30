import { Sym } from "@stemcmicro/atoms";
import { Native, native_sym } from "@stemcmicro/native";
import { items_to_cons, U } from "@stemcmicro/tree";
import { Cons2 } from "../helpers/Cons2";

export function pow<BASE extends U, EXPO extends U>(base: BASE, expo: EXPO): Cons2<Sym, BASE, EXPO> {
    return items_to_cons(native_sym(Native.pow), base, expo) as Cons2<Sym, BASE, EXPO>;
}
