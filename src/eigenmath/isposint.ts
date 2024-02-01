import { Rat } from "math-expression-atoms";
import { isinteger } from "./isinteger";
import { isnegativenumber } from "./isnegativenumber";

export function isposint(p: Rat): boolean {
    return isinteger(p) && !isnegativenumber(p);
}
