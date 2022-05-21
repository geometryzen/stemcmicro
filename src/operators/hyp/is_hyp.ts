import { Hyp } from "../../tree/hyp/Hyp";
import { U } from "../../tree/tree";

export function is_hyp(p: U): p is Hyp {
    return p instanceof Hyp;
}
