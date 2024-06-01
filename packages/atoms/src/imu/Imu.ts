import { U } from "@stemcmicro/tree";
import { JsAtom } from "../atom/JsAtom";

/**
 * The implementation of the imaginary unit.
 */
export class Imu extends JsAtom {
    readonly type = "imu";
    constructor(pos?: number, end?: number) {
        super("Imu", pos, end);
    }
    override equals(other: U): boolean {
        if (this === other) {
            return true;
        }
        if (other instanceof Imu) {
            return true;
        } else {
            return false;
        }
    }
    override toString(): string {
        return "i";
    }
}
/**
 * Determines whether expr is the imaginary unit (imu), (pow -1 1/2).
 * @param expr The expression to test.
 */
export function is_imu(expr: U): expr is Imu {
    return expr instanceof Imu;
    // return is_cons(p) && is_sym(p.opr) && is_native(p.opr, Native.pow) && isminusone(cadr(p)) && isequalq(caddr(p), 1, 2);

    /*
    if (is_cons(expr) && is_pow_2_rat_rat(expr)) {
        const base = expr.lhs;
        const expo = expr.rhs;
        return base.isMinusOne() && expo.isHalf();
    }
    return false;
    */
}

export const imu = new Imu();
