import { ExtensionEnv, FEATURE, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_binop_cons_atom } from "../../hashing/hash_info";
import { MATH_MUL } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, items_to_cons, U } from "../../tree/tree";
import { Blade } from "../../tree/vec/Blade";
import { is_blade } from "../blade/is_blade";
import { and } from "../helpers/and";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { is_any } from "../helpers/is_any";
import { is_uom } from "../uom/is_uom";
import { is_mul_2_any_blade } from "./is_mul_2_any_blade";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

type LL = U;
type LR = Blade;
type LHS = BCons<Sym, LL, LR>;
type RHS = U;
type EXP = BCons<Sym, LHS, RHS>;

/**
 * (X * Blade1) * Blade2 = X * Blade12, where Blade12 = Blade1 * Blade2
 */
class Op extends Function2<LHS, RHS> implements Operator<EXP> {
    readonly hash: string;
    readonly dependencies: FEATURE[] = ['Blade'];
    constructor($: ExtensionEnv) {
        super('mul_2_mul_2_any_blade_blade', MATH_MUL, and(is_cons, is_mul_2_any_blade), is_any, $);
        this.hash = hash_binop_cons_atom(MATH_MUL, MATH_MUL, HASH_ANY);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform2(opr: Sym, lhs: LHS, rhs: RHS, orig: EXP): [TFLAGS, U] {
        if (is_blade(rhs)) {
            const X = lhs.lhs;
            const b1 = lhs.rhs;
            const b2 = rhs;
            return [TFLAG_DIFF, items_to_cons(MATH_MUL, X, b1.mul(b2))];
        }
        else if (is_uom(rhs)) {
            // Leave alone, order is X Blade UOM
            return [TFLAG_NONE, orig];
        }
        else if (this.$.isScalar(rhs)) {
            // TODO: This ordering should be made through comparing factors (centrally).
            const X = lhs.lhs;
            const blade = lhs.rhs;
            const scalar = rhs;
            const X_times_scalar = items_to_cons(MATH_MUL, X, scalar);
            const X_times_scalar_times_blade = items_to_cons(MATH_MUL, X_times_scalar, blade);
            return [TFLAG_DIFF, X_times_scalar_times_blade];
        }
        else {
            // console.lg(`${this.name} orig=${render_as_infix(orig, this.$)}`);
            return [TFLAG_NONE, orig];
        }
    }
}

export const mul_2_mul_2_any_blade_blade = new Builder();
