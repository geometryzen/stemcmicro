import { Sym } from "@stemcmicro/atoms";
import { Native, native_sym } from "@stemcmicro/native";
import { items_to_cons, U } from "@stemcmicro/tree";
import { Cons1 } from "../helpers/Cons1";

export function sin<ARG extends U>(arg: ARG): Cons1<Sym, ARG> {
    return items_to_cons(native_sym(Native.sin), arg) as Cons1<Sym, ARG>;
}
