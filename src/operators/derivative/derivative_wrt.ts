import { ExtensionEnv } from "../../env/ExtensionEnv";
import { is_num } from "../num/is_num";
import { SystemError } from "../../runtime/SystemError";
import { d_scalar_tensor, d_tensor_scalar, d_tensor_tensor } from "../../tensor";
import { is_tensor } from "../tensor/is_tensor";
import { U } from "../../tree/tree";
import { d_scalar_scalar } from "./helpers/derivative_helpers";

export function derivative_wrt(expr: U, wrt: U, $: ExtensionEnv): U {
    if (is_num(wrt)) {
        throw new SystemError('undefined function');
    }
    if (is_tensor(expr)) {
        if (is_tensor(wrt)) {
            return d_tensor_tensor(expr, wrt, $);
        }
        else {
            return d_tensor_scalar(expr, wrt, $);
        }
    }
    else {
        if (is_tensor(wrt)) {
            return d_scalar_tensor(expr, wrt, $);
        }
        else {
            return d_scalar_scalar(expr, wrt, $);
        }
    }
}
