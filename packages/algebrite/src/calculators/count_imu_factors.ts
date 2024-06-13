import { is_imu } from "@stemcmicro/atoms";
import { count_factors } from "@stemcmicro/helpers";
import { Cons } from "@stemcmicro/tree";

export function count_imu_factors(expr: Cons): number {
    return count_factors(expr, is_imu);
}
