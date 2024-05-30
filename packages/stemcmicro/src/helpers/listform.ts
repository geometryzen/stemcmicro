import { assert_str, create_sym } from "@stemcmicro/atoms";
import { ExprContext } from "@stemcmicro/context";
import { items_to_cons, U } from "@stemcmicro/tree";

const LISTFORM = create_sym("listform");

export function listform(arg: U, env: Pick<ExprContext, "valueOf">): string {
    const raw = items_to_cons(LISTFORM, arg);
    try {
        return assert_str(env.valueOf(raw)).str;
    } finally {
        raw.release();
    }
}
