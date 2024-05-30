import { Rat } from "@stemcmicro/atoms";

export function isposint(x: Rat): boolean {
    return x.isPositiveInteger();
}
