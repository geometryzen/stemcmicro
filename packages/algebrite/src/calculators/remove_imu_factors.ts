import { is_imu } from "@stemcmicro/atoms";
import { remove_factors } from "@stemcmicro/helpers";
import { Cons, U } from "@stemcmicro/tree";

export function remove_imu_factors(expr: Cons): U {
    return remove_factors(expr, is_imu);
}
