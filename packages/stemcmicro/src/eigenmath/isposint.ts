import { Rat } from "math-expression-atoms";

export function isposint(x: Rat): boolean {
    return x.isPositiveInteger();
}
