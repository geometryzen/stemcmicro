import { Str } from "../../tree/str/Str";
import { U } from "../../tree/tree";

export function is_str(expr: U): expr is Str {
    return expr instanceof Str;
}
