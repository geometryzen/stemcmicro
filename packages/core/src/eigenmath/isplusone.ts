import { U } from "@stemcmicro/tree";
import { isequaln } from "./isequaln";

export function isplusone(expr: U): boolean {
    return isequaln(expr, 1);
}
