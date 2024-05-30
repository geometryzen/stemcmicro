import { Cons } from "@stemcmicro/tree";

export function is_nonop(expr: Cons): boolean {
    return expr.length === 1;
}
