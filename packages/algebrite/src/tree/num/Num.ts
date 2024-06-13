import { Flt, Rat } from "@stemcmicro/atoms";

/**
 * The Num type is the union of Flt and Rat (and maybe Int in future).
 * While the concept of a number in mathematics may be quite general, in this case we mean the
 * set of things that we can calculate with. Not surprisingly, these need to be treated as a
 * combined entity so that simlifications can be performed.
 */
export type Num = Flt | Rat;
