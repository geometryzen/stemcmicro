import { is_rat } from "@stemcmicro/atoms";
import { ExprContext } from "@stemcmicro/context";
import { Native, native_sym } from "@stemcmicro/native";
import { items_to_cons, U } from "@stemcmicro/tree";
import { is_boo } from "../operators/boo/is_boo";
import { ProgrammingError } from "../programming/ProgrammingError";

const ISREAL = native_sym(Native.isreal);

export function isreal(arg: U, env: Pick<ExprContext, "valueOf">): boolean {
    const raw = items_to_cons(ISREAL, arg);
    try {
        const retval = env.valueOf(raw);
        try {
            if (is_boo(retval)) {
                return retval.isTrue();
            } else if (is_rat(retval)) {
                return retval.isZero() ? false : true;
            } else {
                throw new ProgrammingError(`${retval}`);
            }
        } finally {
            retval.release();
        }
    } finally {
        raw.release();
    }
}
