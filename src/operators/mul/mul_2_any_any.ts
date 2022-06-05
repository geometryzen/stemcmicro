
import { compare_factors } from "../../calculators/compare/compare_factors";
import { ExtensionEnv, Operator, OperatorBuilder, SIGN_EQ, SIGN_GT, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_binop_atom_atom } from "../../hashing/hash_info";
import { makeList } from "../../makeList";
import { MATH_MUL, MATH_POW } from "../../runtime/ns_math";
import { two } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
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
type EXPR = BCons<Sym, LHS, RHS>;

/**
 * X * X => X ** 2
 */
class Op extends Function2<LHS, RHS> implements Operator<EXPR> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('mul_2_any_any', MATH_MUL, is_any, is_any, $);
        this.hash = hash_binop_atom_atom(MATH_MUL, HASH_ANY, HASH_ANY);
    }
    isReal(expr: EXPR): boolean {
        const $ = this.$;
        return ($.isReal(expr.lhs) && $.isReal(expr.rhs));
    }
    isImag(expr: EXPR): boolean {
        const $ = this.$;
        return ($.isImag(expr.lhs) && $.isReal(expr.rhs)) || ($.isReal(expr.lhs) && $.isImag(expr.rhs));
    }
    isScalar(expr: EXPR): boolean {
        const $ = this.$;
        return $.isScalar(expr.lhs) && $.isScalar(expr.rhs);
    }
    isVector(expr: EXPR): boolean {
        const $ = this.$;
        return ($.isScalar(expr.lhs) && $.isVector(expr.rhs)) || ($.isVector(expr.lhs) && $.isScalar(expr.rhs));
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS, orig: EXPR): [TFLAGS, U] {
        const $ = this.$;
        switch (compare_factors(lhs, rhs, $)) {
            case SIGN_GT: {
                // This flipping of e.g. (a*b)*c to c*(a*b) is way to coarse and conflist with e.g. mul_2_sym_mul_2_sym_sym.
                // const A = makeList(opr, rhs, lhs);
                // console.log(`${this.name} ${print_expr(orig, $)} A = ${print_expr(A, $)}`);
                // const B = $.valueOf(A);
                // console.log(`${this.name} ${print_expr(orig, $)} B = ${print_expr(B, $)}`);
                // return [CHANGED, B];
                return [TFLAG_NONE, orig];
            }
            case SIGN_EQ: {
                if (lhs.equals(rhs)) {
                    return [TFLAG_DIFF, $.valueOf(makeList(MATH_POW, lhs, two))];
                }
                return [TFLAG_NONE, orig];
                break;
            }
            default: {
                return [TFLAG_NONE, orig];
            }
        }
    }
}

export const mul_2_any_any = new Builder();
