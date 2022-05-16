import { CHANGED, ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { hash_binop_atom_cons, HASH_BLADE } from "../../hashing/hash_info";
import { makeList } from "../../makeList";
import { MATH_MUL } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, U } from "../../tree/tree";
import { Blade } from "../../tree/vec/Blade";
import { is_blade } from "../blade/BladeExtension";
import { and } from "../helpers/and";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { is_mul_2_blade_any } from "../mul/is_mul_2_blade_any";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

type LHS = Blade;
type RHS = BCons<Sym, Blade, U>;
type EXPR = BCons<Sym, LHS, RHS>;

/**
 * Blade1 * (Blade2 * X) => (Blade1 * Blade2) * X
 */
class Op extends Function2<LHS, RHS> implements Operator<EXPR> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('simplify_mul_2_blade_mul_2_blade_any', MATH_MUL, is_blade, and(is_cons, is_mul_2_blade_any), $);
        this.hash = hash_binop_atom_cons(MATH_MUL, HASH_BLADE, MATH_MUL);
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS): [TFLAGS, U] {
        const $ = this.$;
        const b1 = lhs;
        const b2 = rhs.lhs;
        const b1b2 = b1.mul(b2);
        const X = rhs.rhs;
        const S = $.valueOf(makeList(MATH_MUL, b1b2, X));
        return [CHANGED, S];
    }
}

export const simplify_mul_2_blade_mul_2_blade_any = new Builder();
