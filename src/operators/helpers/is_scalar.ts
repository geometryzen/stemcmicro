import { ExtensionEnv } from "../../env/ExtensionEnv";
import { U } from "../../tree/tree";

export function is_scalar($: ExtensionEnv) {
    return function (expr: U): expr is U {
        // console.lg("is_scalar", $.toSExprString(expr));
        return $.isScalar(expr);
    };
}
