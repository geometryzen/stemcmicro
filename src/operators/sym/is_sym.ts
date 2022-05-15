import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";

export function is_sym(expr: U): expr is Sym {
    return expr instanceof Sym;
}