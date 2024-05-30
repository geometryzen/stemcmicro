import { Sym } from "math-expression-atoms";
import { Native, native_sym } from "math-expression-native";
import { items_to_cons, U } from "math-expression-tree";
import { Cons1 } from "../helpers/Cons1";

export function sin<ARG extends U>(arg: ARG): Cons1<Sym, ARG> {
    return items_to_cons(native_sym(Native.sin), arg) as Cons1<Sym, ARG>;
}
