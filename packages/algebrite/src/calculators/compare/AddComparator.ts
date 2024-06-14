import { U } from "@stemcmicro/tree";
import { ExprComparator, Sign } from "../../env/ExtensionEnv";
import { compare_terms } from "./compare_terms";

export class AddComparator implements ExprComparator {
    compare(lhs: U, rhs: U): Sign {
        return compare_terms(lhs, rhs);
    }
}
