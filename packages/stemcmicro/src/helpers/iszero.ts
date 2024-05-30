import { is_rat } from "@stemcmicro/atoms";
import { ExprContext } from "@stemcmicro/context";
import { Native, native_sym } from "@stemcmicro/native";
import { items_to_cons, U } from "@stemcmicro/tree";
import { is_boo } from "../operators/boo/is_boo";
import { ProgrammingError } from "../programming/ProgrammingError";

const ISZERO = native_sym(Native.iszero);

export function iszero(arg: U, env: Pick<ExprContext, "valueOf">): boolean {
    const raw = items_to_cons(ISZERO, arg);
    try {
        const retval = env.valueOf(raw);
        try {
            if (is_boo(retval)) {
                return retval.isTrue();
            } else if (is_rat(retval)) {
                return retval.isZero() ? false : true;
            } else {
                throw new ProgrammingError();
            }
        } finally {
            retval.release();
        }
    } finally {
        raw.release();
    }
}
