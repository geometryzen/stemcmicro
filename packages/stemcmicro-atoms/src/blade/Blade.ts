import { U } from "@stemcmicro/tree";
import { BasisBlade } from "./BasisBlade";

/**
 * The type representing a geometric algebra basis blade.
 * This is a generalization of a vector.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Blade extends BasisBlade<U, U> {
    // Nothing to see here.
}
