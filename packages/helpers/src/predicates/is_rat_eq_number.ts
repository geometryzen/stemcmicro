import { Rat } from "@stemcmicro/atoms";

export function is_rat_eq_number(expr: Rat, n: number): boolean {
    return expr.a.equals(n) && expr.b.equals(1);
}
