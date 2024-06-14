import { Sign } from "@stemcmicro/context";
import { U } from "@stemcmicro/tree";
import { ExprComparator } from "../../env/ExtensionEnv";
import { compare_factor_factor } from "./compare_function_multiply";

export class MulComparator implements ExprComparator {
    compare(lhs: U, rhs: U): Sign {
        return compare_factor_factor(lhs, rhs);
    }
}
