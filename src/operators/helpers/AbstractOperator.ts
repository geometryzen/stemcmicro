import { cadnr } from "../../calculators/cadnr";
import { cons_to_infix_string } from "../../calculators/cons_to_infix_string";
import { cons_to_list_string } from "../../calculators/cons_to_list_string";
import { ExtensionEnv, Sign } from "../../env/ExtensionEnv";
import { makeList } from "../../makeList";
import { SystemError } from "../../runtime/SystemError";
import { subst } from "../../subst";
import { is_cons, U } from "../../tree/tree";
import { is_sym } from "../sym/is_sym";

/**
 * Provides a base implementation of an operator.
 * The main reusable features are:
 * 1. Matching in both operator and operand position.
 * 2. Reference counting.
 * 3. Rendering toInfixString and toListString.
 * 4. contains()
 * TODO: The hope is that the dead-code methods can be removed when refactoring is complete.
 */
export abstract class AbstractOperator {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    constructor(public readonly name: string, protected readonly $: ExtensionEnv) {
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    compareFactors(lhs: U, rhs: U): Sign {
        throw new Error("Abtract Operator Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    compareTerms(lhs: U, rhs: U): Sign {
        throw new Error("Abtract Operator Method not implemented.");
    }
    subst(expr: U, oldExpr: U, newExpr: U): U {
        const $ = this.$;

        if ($.equals(expr, oldExpr)) {
            return newExpr;
        }
        if (is_cons(expr)) {
            const opr = cadnr(expr, 0);
            const subst_opr = subst(opr, oldExpr, newExpr, $);
            if ($.equals(subst_opr, opr)) {
                // TODO: Generalize the assumption of binary.
                const lhs = cadnr(expr, 1);
                const rhs = cadnr(expr, 2);
                const subst_lhs = subst(lhs, oldExpr, newExpr, $);
                const subst_rhs = subst(rhs, oldExpr, newExpr, $);
                if ($.equals(lhs, subst_lhs) && $.equals(rhs, subst_rhs)) {
                    return expr;
                }
                else {
                    return makeList(opr, subst_lhs, subst_rhs);
                }
            }
            else {
                const lhs = cadnr(expr, 1);
                const rhs = cadnr(expr, 2);
                return makeList(subst_opr, subst(lhs, oldExpr, newExpr, $), subst(rhs, oldExpr, newExpr, $));
            }
        }
        if (is_sym(expr)) {
            if (is_sym(oldExpr)) {
                if (expr.equalsSym(oldExpr)) {
                    return newExpr;
                }
                else {
                    return expr;
                }
            }
            else {
                return expr;
            }
        }
        throw new SystemError();
    }
    toInfixString(expr: U): string {
        if (is_cons(expr)) {
            return cons_to_infix_string(expr, this.$);
        }
        throw new SystemError();
    }
    toListString(expr: U): string {
        if (is_cons(expr)) {
            return cons_to_list_string(expr, this.$);
        }
        throw new SystemError();
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    valueOf(expr: U): U {
        throw new Error(`AbstractOperator.valueOf ${expr} method not implemented.`);
    }
}