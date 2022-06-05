import { Flt } from "../../tree/flt/Flt";
import { U } from "../../tree/tree";

export function is_flt(expr: U): expr is Flt {
    return expr instanceof Flt;
}
