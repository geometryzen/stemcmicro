import { compare_terms } from "@stemcmicro/helpers";
import { U } from "@stemcmicro/tree";
import { ExprComparator, Sign } from "../../env/ExtensionEnv";

export class AddComparator implements ExprComparator {
    compare(lhs: U, rhs: U): Sign {
        return compare_terms(lhs, rhs);
    }
}
