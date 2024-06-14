import { Sign } from "@stemcmicro/context";
import { compare_factors } from "@stemcmicro/helpers";
import { U } from "@stemcmicro/tree";
import { ExprComparator } from "../../env/ExtensionEnv";

export class MulComparator implements ExprComparator {
    compare(lhs: U, rhs: U): Sign {
        return compare_factors(lhs, rhs);
    }
}
