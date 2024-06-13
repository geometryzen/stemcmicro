import { ExprContext } from "@stemcmicro/context";
import { U } from "@stemcmicro/tree";
import { is_scalar } from "../operators/isscalar/is_scalar";

// const ISSCALAR = native_sym(Native.);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function isscalar(arg: U, env: Pick<ExprContext, "valueOf">): arg is U {
    // TODO: delegate to handler and operators
    return is_scalar(arg);
}
