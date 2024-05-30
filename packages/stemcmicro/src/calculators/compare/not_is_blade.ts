import { is_blade } from "@stemcmicro/atoms";
import { U } from "../../tree/tree";

export const not_is_blade = (expr: U) => !is_blade(expr);
