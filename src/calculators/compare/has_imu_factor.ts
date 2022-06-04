import { is_imu } from "../../operators/imu/is_imu";
import { U } from "../../tree/tree";
import { factorizeL } from "../factorizeL";

export function has_imu_factor(expr: U): boolean {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [a, b] = factorizeL(expr);
    return is_imu(a);
}
