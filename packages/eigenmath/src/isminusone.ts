import { U } from "@stemcmicro/tree";
import { isequaln } from "./isequaln";

export function isminusone(p: U): boolean {
    return isequaln(p, -1);
}
