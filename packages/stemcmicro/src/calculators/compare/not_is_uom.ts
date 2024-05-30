import { is_uom } from "@stemcmicro/atoms";
import { U } from "@stemcmicro/tree";

export const not_is_uom = (expr: U) => !is_uom(expr);
