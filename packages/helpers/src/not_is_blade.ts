import { is_blade } from "@stemcmicro/atoms";
import { U } from "@stemcmicro/tree";

export const not_is_blade = (expr: U) => !is_blade(expr);
