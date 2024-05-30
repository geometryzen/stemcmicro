import { is_blade } from "math-expression-atoms";
import { U } from "../../tree/tree";

export const not_is_blade = (expr: U) => !is_blade(expr);
