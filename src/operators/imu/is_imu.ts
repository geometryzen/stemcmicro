// import { BCons } from "../operators/helpers/BCons";
// import { is_pow_2_rat_rat } from "../operators/pow/is_pow_2_rat_rat";
import { Imu } from "../../tree/imu/Imu";
// import { Rat } from "../tree/rat/Rat";
// import { Sym } from "../tree/sym/Sym";
import { U } from "../../tree/tree";

/**
 * @hidden
 */
export type IMU_TYPE = Imu;
// export type IMU_TYPE = BCons<Sym, Rat, Rat>;

/**
 * Determines whether expr is the imaginary unit (imu), (pow -1 1/2).
 * @param expr The expression to test.
 */
export function is_imu(expr: U): expr is IMU_TYPE {
    return expr instanceof Imu;
    /*
    if (is_cons(expr) && is_pow_2_rat_rat(expr)) {
        const base = expr.lhs;
        const expo = expr.rhs;
        return base.isMinusOne() && expo.isHalf();
    }
    return false;
    */
}
