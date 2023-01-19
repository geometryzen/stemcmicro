import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_binop_atom_atom } from "../../hashing/hash_info";
import { MATH_MUL, MATH_POW } from "../../runtime/ns_math";
import { one } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, items_to_cons, U } from "../../tree/tree";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { is_any } from "../helpers/is_any";
import { is_rat } from "../rat/is_rat";
import { power_v1 } from "./power_v1";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

type LHS = U;
type RHS = U;
type EXP = BCons<Sym, LHS, RHS>;

/**
 * 
 */
class Op extends Function2<LHS, RHS> implements Operator<EXP> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('pow_2_any_any', MATH_POW, is_any, is_any, $);
        this.hash = hash_binop_atom_atom(MATH_POW, HASH_ANY, HASH_ANY);
    }
    isZero(expr: EXP): boolean {
        return this.$.isZero(expr.lhs);
    }
    transform2(opr: Sym, base: LHS, expo: RHS, expr: EXP): [TFLAGS, U] {
        const $ = this.$;
        if ($.isExplicating()) {
            // TODO: We should allow the parts to explicate.
            return [TFLAG_NONE, expr];
        }
        else if ($.isExpanding()) {
            if (is_rat(expo) && expo.isInteger()) {
                // TODO: Handle case when n < 0
                const n = expo.toNumber();
                if (n > 0) {
                    // console.lg(`${this.hash} base=>${render_as_infix(base, $)} expo=>${render_as_infix(expo, $)} n=${n}`);
                    let retval: U = one;
                    for (let i = 0; i < n; i++) {
                        retval = $.valueOf(items_to_cons(MATH_MUL, retval, base));
                    }
                    return retval.equals(expr) ? [TFLAG_NONE, expr] : [TFLAG_DIFF, retval];
                }
                else {
                    const newExpr = power_v1(base, expo, expr, this.$);
                    return [!newExpr.equals(expr) ? TFLAG_DIFF : TFLAG_NONE, newExpr];
                }
            }
            else {
                const newExpr = power_v1(base, expo, expr, this.$);
                return [!newExpr.equals(expr) ? TFLAG_DIFF : TFLAG_NONE, newExpr];
            }
        }
        else if ($.isFactoring()) {
            return [TFLAG_NONE, expr];
        }
        else if ($.isImplicating()) {
            // TODO: We should allow the parts to implicate.
            return [TFLAG_NONE, expr];
        }
        else {
            throw new Error();
        }
    }
}

export const pow_2_any_any = new Builder();
