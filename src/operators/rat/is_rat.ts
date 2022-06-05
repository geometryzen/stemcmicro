import { Rat } from "../../tree/rat/Rat";
import { U } from "../../tree/tree";

export function is_rat(expr: U): expr is Rat {
    return expr instanceof Rat;
}
