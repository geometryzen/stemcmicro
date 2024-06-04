import { U } from "@stemcmicro/tree";

export type Sign = -1 | 0 | 1;
export const SIGN_LT = -1;
export const SIGN_EQ = 0;
export const SIGN_GT = 1;

export type CompareFn = (lhs: U, rhs: U) => Sign;
