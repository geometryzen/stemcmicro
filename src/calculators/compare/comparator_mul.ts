import { ExprComparator, ExtensionEnv, Sign, SIGN_EQ } from "../../env/ExtensionEnv";
import { U } from "../../tree/tree";
import { cmp_expr } from "./cmp_expr";
import { contains_single_blade } from "./contains_single_blade";

export class MulComparator implements ExprComparator {
    compare(lhs: U, rhs: U, $: ExtensionEnv): Sign {
        // console.lg("ENTERING :", "cmp_factors", "lhs", render_as_sexpr(lhs, $), "rhs", render_as_sexpr(rhs, $));

        if (lhs === rhs || lhs.equals(rhs)) {
            return SIGN_EQ;
        }

        if (contains_single_blade(lhs) && contains_single_blade(rhs)) {
            return SIGN_EQ;
        }
        return cmp_expr(lhs, rhs, $);
    }
}
