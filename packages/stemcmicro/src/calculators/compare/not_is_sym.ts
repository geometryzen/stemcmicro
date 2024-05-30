import { is_sym } from "@stemcmicro/atoms";
import { U } from "@stemcmicro/tree";

export const not_is_sym = (expr: U) => !is_sym(expr);
