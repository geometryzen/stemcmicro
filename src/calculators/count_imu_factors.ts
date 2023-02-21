import { is_imu } from "../operators/imu/is_imu";
import { is_mul } from "../operators/mul/is_mul";
import { Cons, is_nil } from "../tree/tree";

export function count_imu_factors(expr: Cons): number {
    const L0 = expr;
    if (is_mul(L0)) {
        return count_imu_factors_recursive(L0.argList);
    }
    else {
        return 0;
    }
}
export function count_imu_factors_recursive(argList: Cons): number {
    if (is_nil(argList)) {
        return 0;
    }
    else {
        const arg = argList.car;
        if (is_imu(arg)) {
            return 1 + count_imu_factors_recursive(argList.argList);
        }
        else {
            return count_imu_factors_recursive(argList.argList);
        }
    }
}