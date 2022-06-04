import { Flt } from "../../tree/flt/Flt";

// TODO: Move into the Double module.
export function is_flt(p: unknown): p is Flt {
    return p instanceof Flt;
}
