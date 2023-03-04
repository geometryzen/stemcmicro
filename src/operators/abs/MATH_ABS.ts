import { create_sym } from "../../tree/sym/Sym";

/**
 * abs(x) = ... (expt (| x x) 1/2)
 */
export const MATH_ABS = create_sym('abs');