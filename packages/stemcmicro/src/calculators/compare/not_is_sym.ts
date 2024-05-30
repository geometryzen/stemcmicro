import { is_sym } from "math-expression-atoms";
import { U } from "math-expression-tree";

export const not_is_sym = (expr: U) => !is_sym(expr);
