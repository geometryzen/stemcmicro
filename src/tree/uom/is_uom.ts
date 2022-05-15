import { Uom } from "./Uom";

export function is_uom(p: unknown): p is Uom {
    return p instanceof Uom;
}
