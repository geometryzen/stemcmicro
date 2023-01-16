import { ExtensionEnv } from "../../env/ExtensionEnv";
import { SystemError } from "../../runtime/SystemError";
import { d_scalar_tensor, d_tensor_scalar, d_tensor_tensor } from "../../tensor";
import { U } from "../../tree/tree";
import { is_num } from "../num/is_num";
import { is_tensor } from "../tensor/is_tensor";
import { d_scalar_scalar } from "./helpers/derivative_helpers";

/**
 * Constructs the derivative of expr with respect to X.
 */
export function derivative(expr: U, X: U, $: ExtensionEnv): U {
    // console.lg("derivative");
    // console.lg(`expr=${render_as_sexpr(expr, $)}`);
    // console.lg(`wrt=${render_as_sexpr(X, $)}`);
    if (is_num(X)) {
        throw new SystemError('undefined function');
    }
    if (is_tensor(expr)) {
        if (is_tensor(X)) {
            return d_tensor_tensor(expr, X, $);
        }
        else {
            return d_tensor_scalar(expr, X, $);
        }
    }
    else {
        if (is_tensor(X)) {
            return d_scalar_tensor(expr, X, $);
        }
        else {
            return d_scalar_scalar(expr, X, $);
        }
    }
}
