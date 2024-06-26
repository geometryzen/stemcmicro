import { is_num, is_sym } from "@stemcmicro/atoms";
import { is_native, Native } from "@stemcmicro/native";
import { is_cons, U } from "@stemcmicro/tree";

export function isnegativeterm(expr: U): boolean {
    if (is_num(expr) && expr.isNegative()) {
        return true;
    } else if (is_cons(expr) && is_sym(expr.opr) && is_native(expr.opr, Native.multiply)) {
        const argList = expr.argList;
        try {
            const head = argList.head;
            try {
                return is_num(head) && head.isNegative();
            } finally {
                head.release();
            }
        } finally {
            argList.release();
        }
    } else {
        return false;
    }
}
