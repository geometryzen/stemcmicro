import { is_blade } from "../../operators/blade/is_blade";
import { U } from "../../tree/tree";

export const not_is_blade = (expr: U) => !is_blade(expr);
