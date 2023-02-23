import { is_imu } from "../operators/imu/is_imu";
import { Cons } from "../tree/tree";
import { count_factors } from "./count_factors";

export function count_imu_factors(expr: Cons): number {
    return count_factors(expr, is_imu);
}
