import { ExprContext } from "@stemcmicro/context";
import { U } from "@stemcmicro/tree";
import { ExprComparator, Sign } from "../../env/ExtensionEnv";
import { compare_term_term } from "./compare_term_term";

export class AddComparator implements ExprComparator {
    compare(lhs: U, rhs: U, $: ExprContext): Sign {
        return compare_term_term(lhs, rhs, $);
    }
}
