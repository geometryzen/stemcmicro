
import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { hash_binop_cons_cons } from "../../hashing/hash_info";
import { items_to_cons } from "../../makeList";
import { MATH_MUL, MATH_POW } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { BCons } from "../helpers/BCons";
import { Function2X } from "../helpers/Function2X";
import { GUARD } from "../helpers/GUARD";
import { is_pow_2_any_any } from "../pow/is_pow_2_any_any";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

type LHS = BCons<Sym, U, U>;
type RHS = BCons<Sym, U, U>;
type EXP = BCons<Sym, LHS, RHS>;

function cross($: ExtensionEnv) {
    return function (lhs: LHS, rhs: RHS): boolean {
        const is_factoring = $.isFactoring();
        if (is_factoring) {
            const k1 = lhs.rhs;
            const k2 = rhs.rhs;
            const k1_equals_k2 = k1.equals(k2);
            // console.lg(`k1_equals_k2=${k1_equals_k2}`);
            // console.lg(`k1=${k1}`);
            // console.lg(`k2=${k2}`);
            if (k1_equals_k2) {
                // console.lg(`lhs=${lhs}, rhs=${rhs}`);
                const x = lhs.lhs;
                const x_is_scalar = $.isScalar(x);
                // console.lg(`x=${x}`);
                // console.lg(`x_is_scalar=${x_is_scalar}`);
                const y = rhs.lhs;
                // console.lg(`y=${y}`);
                const y_is_scalar = $.isScalar(y);
                // console.lg(`y_is_scalar=${y_is_scalar}`);
                return k1_equals_k2 && x_is_scalar && y_is_scalar;
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    };
}

const guardL: GUARD<U, LHS> = and(is_cons, is_pow_2_any_any);
const guardR: GUARD<U, RHS> = and(is_cons, is_pow_2_any_any);

/**
 * (x ** k) * (y ** k) =>  (x * y) ** k, provided x and y commute (scalars).
 * Don't do this! 
 */
class Op extends Function2X<LHS, RHS> implements Operator<EXP> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('mul_2_pow_2_sym_any_pow_2_sym_any', MATH_MUL, guardL, guardR, cross($), $);
        this.hash = hash_binop_cons_cons(MATH_MUL, MATH_POW, MATH_POW);
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS): [TFLAGS, U] {
        const $ = this.$;
        const x = lhs.lhs;
        const y = rhs.lhs;
        const k = lhs.rhs;
        const xy = $.valueOf(items_to_cons(opr, x, y));
        const retval = $.valueOf(items_to_cons(MATH_POW, xy, k));
        // console.lg(`retval=${retval}`);
        return [TFLAG_DIFF, retval];
    }
}

export const mul_2_pow_2_sym_any_pow_2_sym_any = new Builder();
