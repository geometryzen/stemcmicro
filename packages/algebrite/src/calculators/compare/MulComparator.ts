import { Sign } from "@stemcmicro/context";
import { U } from "@stemcmicro/tree";
import { ExprComparator } from "../../env/ExtensionEnv";
import { compare_factors } from "./compare_factors";

export class MulComparator implements ExprComparator {
    compare(lhs: U, rhs: U): Sign {
        return compare_factors(lhs, rhs);
    }
}
