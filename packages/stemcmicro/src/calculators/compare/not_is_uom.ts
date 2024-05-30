import { is_uom } from "math-expression-atoms";
import { U } from "math-expression-tree";

export const not_is_uom = (expr: U) => !is_uom(expr);
