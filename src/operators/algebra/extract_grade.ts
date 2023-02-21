import { ExtensionEnv } from "../../env/ExtensionEnv";
import { zero } from "../../tree/rat/Rat";
import { is_cons, items_to_cons, U } from "../../tree/tree";
import { is_blade } from "../blade/is_blade";
import { is_mul_2_any_any } from "../mul/is_mul_2_any_any";
import { is_rat } from "../rat/rat_extension";

export function extract_grade(arg: U, grade: number, $: ExtensionEnv): U {
    if (is_blade(arg)) {
        const extracted = arg.extractGrade(grade);
        return extracted;
    }
    else if (is_rat(arg)) {
        if (grade === 0) {
            return arg;
        }
        else {
            return zero;
        }
    }
    else if (is_cons(arg) && is_mul_2_any_any(arg)) {
        const lhs = arg.lhs;
        const rhs = arg.rhs;
        if ($.isScalar(lhs)) {
            throw new Error(`extractGrade   ${lhs} * ${rhs}`);
        }
        if ($.isScalar(rhs)) {
            return items_to_cons(arg.opr, extract_grade(lhs, grade, $), rhs);
        }
        throw new Error(`extractGrade   ${lhs} * ${rhs}`);
    }
    else {
        throw new Error(`extractGrade(arg => ${arg}, grade => ${grade}) function not implemented.`);
    }
}
