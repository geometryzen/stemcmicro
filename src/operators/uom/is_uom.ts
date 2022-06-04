import { U } from "../../tree/tree";
import { Uom } from "../../tree/uom/Uom";

export function is_uom(expr: U): expr is Uom {
    return expr instanceof Uom;
}
