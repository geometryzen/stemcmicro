import { is_rat, Rat } from "math-expression-atoms";
import { isinteger } from "./isinteger";

export function isfraction(p: Rat): boolean {
    return is_rat(p) && !isinteger(p);
}
