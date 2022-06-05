import { Hyp } from "../../tree/hyp/Hyp";
import { U } from "../../tree/tree";

export function is_hyp(expr: U): expr is Hyp {
    return expr instanceof Hyp;
}
