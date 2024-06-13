import { assert_str } from "@stemcmicro/atoms";
import { ExprContext } from "@stemcmicro/context";
import { Native, native_sym } from "@stemcmicro/native";
import { items_to_cons, U } from "@stemcmicro/tree";

const INFIX = native_sym(Native.infix);

export function infix(arg: U, env: Pick<ExprContext, "valueOf">): string {
    const raw = items_to_cons(INFIX, arg);
    try {
        return assert_str(env.valueOf(raw)).str;
    } finally {
        raw.release();
    }
}
