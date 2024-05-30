import { U } from "math-expression-tree";
import { TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../env/ExtensionEnv";

/**
 * A convenience function for constructing transform results and peforming correct reference counting.
 * If the expressions are the same then we return the oldExpr (it may have better positional metadata), and TFLAG_NONE.
 * If the expressions differ, we return newExpr and TFLAG_DIFF.
 *
 */
export function wrap_as_transform(newExpr: U, oldExpr: U): [TFLAGS, U] {
    if (newExpr.equals(oldExpr)) {
        // If the expressions have the same value, we return the oldExpr because it may have better meta information
        // such as pos and end properties.
        oldExpr.addRef();
        return [TFLAG_NONE, oldExpr];
    } else {
        newExpr.addRef();
        return [TFLAG_DIFF, newExpr];
    }
}
