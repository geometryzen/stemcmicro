import { Cons } from "math-expression-tree";
import { is_imu } from "../operators/imu/is_imu";
import { count_factors } from "./count_factors";

export function count_imu_factors(expr: Cons): number {
    return count_factors(expr, is_imu);
}
