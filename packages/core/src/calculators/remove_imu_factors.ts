import { is_imu } from "../operators/imu/is_imu";
import { Cons, U } from "../tree/tree";
import { remove_factors } from "./remove_factors";

export function remove_imu_factors(expr: Cons): U {
    return remove_factors(expr, is_imu);
}
