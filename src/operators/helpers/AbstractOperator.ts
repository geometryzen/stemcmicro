import { is_sym } from "math-expression-atoms";
import { is_cons, items_to_cons, U } from "math-expression-tree";
import { ExtensionEnv, Sign } from "../../env/ExtensionEnv";
import { render_as_infix } from "../../print/render_as_infix";
import { render_as_latex } from "../../print/render_as_latex";
import { render_as_sexpr } from "../../print/render_as_sexpr";
import { SystemError } from "../../runtime/SystemError";
import { subst } from "../subst/subst";

/**
 * Provides a base implementation of an operator.
 * The main reusable features are:
 * 1. Matching in both operator and operand position.
 * 2. Rendering to Infix, LaTeX, and SExpr.
 * 3. contains()
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

        if (expr.equals(oldExpr)) {
            return newExpr;
        }
        if (is_cons(expr)) {
            const opr = expr.opr;
            const subst_opr = subst(opr, oldExpr, newExpr, $);
            if (subst_opr.equals(opr)) {
                // TODO: Generalize the assumption of binary.
                const lhs = expr.lhs;
                const rhs = expr.rhs;
                const subst_lhs = subst(lhs, oldExpr, newExpr, $);
                const subst_rhs = subst(rhs, oldExpr, newExpr, $);
                if (lhs.equals(subst_lhs) && rhs.equals(subst_rhs)) {
                    return expr;
                }
                else {
                    return items_to_cons(opr, subst_lhs, subst_rhs);
                }
            }
            else {
                const lhs = expr.lhs;
                const rhs = expr.rhs;
                return items_to_cons(subst_opr, subst(lhs, oldExpr, newExpr, $), subst(rhs, oldExpr, newExpr, $));
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
        return render_as_infix(expr, this.$);
    }
    toLatexString(expr: U): string {
        return render_as_latex(expr, this.$);
    }
    toListString(expr: U): string {
        return render_as_sexpr(expr, this.$);
    }
    valueOf(expr: U): U {
        return this.$.valueOf(expr);
    }
}