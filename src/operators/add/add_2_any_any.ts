import { compare_terms_redux } from "../../calculators/compare/compare_terms";
import { is_zero_sum } from "../../calculators/factorize/is_zero_sum";
import { ExtensionEnv, NOFLAGS, Operator, OperatorBuilder, SIGN_EQ, SIGN_GT, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_binop_atom_atom } from "../../hashing/hash_info";
import { MATH_ADD, MATH_MUL } from "../../runtime/ns_math";
import { two } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, makeList, U } from "../../tree/tree";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { is_any } from "../helpers/is_any";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

type LHS = U;
type RHS = U;
type EXP = BCons<Sym, LHS, RHS>;
/*
function cross($: ExtensionEnv) {
    return function (lhs: LHS, rhs: RHS): boolean {
        switch (compare_terms_redux(lhs, rhs, $)) {
            case SIGN_GT: {
                return true;
            }
            case SIGN_EQ: {
                return lhs.equals(rhs);
            }
            default: {
                return false;
            }
        }
    };
}
*/

/**
 * transform(X + Y) => transform(X) + transform(Y)
 * 
 * As a special case, when X an Y are equal,
 * 
 * X + X => 2 * X
 */
class Op extends Function2<LHS, RHS> implements Operator<EXP> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('add_2_any_any', MATH_ADD, is_any, is_any, $);
        this.hash = hash_binop_atom_atom(MATH_ADD, HASH_ANY, HASH_ANY);
    }
    isZero(expr: EXP): boolean {
        // The answer will almost certainly be false if the transformer to remove such cancellations is installed.
        return is_zero_sum(expr.lhs, expr.rhs, this.$);
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS, expr: EXP): [TFLAGS, U] {
        const $ = this.$;
        // console.log(`lhs=${print_list(lhs, $)} rhs=${print_list(rhs, $)}`);
        switch (compare_terms_redux(lhs, rhs, $)) {
            case SIGN_GT: {
                const A = makeList(opr, rhs, lhs);
                // console.log(`A=${print_list(A, $)}`);
                const B = $.valueOf(A);
                return [TFLAG_DIFF, B];
            }
            case SIGN_EQ: {
                if (lhs.equals(rhs)) {
                    return [TFLAG_DIFF, $.valueOf(makeList(MATH_MUL, two, lhs))];
                }
                else {
                    return [NOFLAGS, expr];
                }
            }
            default: {
                // The following works, but it's not what we want when trying to rationalize an expression.
                /*
                if ($.isFactoring()) {
                    if ($.isAssocL(MATH_MUL)) {
                        const l = leftmost_factor(lhs);
                        const r = leftmost_factor(rhs);
                        if (l.equals(r)) {
                            console.log(`${this.name} l=${print_list(l, $)} r=${print_list(r, $)}`);
                            const lprime = $.valueOf($.divide(lhs,l));
                            const rprime = $.valueOf($.divide(rhs,r));
                            console.log(`${this.name} lprime=${print_list(lprime, $)} rprime=${print_list(rprime, $)}`);
                        }
                    }
                }
                */
                return [NOFLAGS, expr];
            }
        }
    }
}
export const add_2_any_any = new Builder();
