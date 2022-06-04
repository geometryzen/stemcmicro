
import { ExtensionEnv, Operator, OperatorBuilder, FOCUS_FLAGS_EXPANDING_UNION_FACTORING, TFLAGS, TFLAG_NONE } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_binop_atom_atom, HASH_BLADE } from "../../hashing/hash_info";
import { MATH_MUL } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { bitCount } from "../../tree/vec/bitCount";
import { Blade } from "../../tree/vec/Blade";
import { is_blade } from "../blade/is_blade";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { is_scalar } from "../helpers/is_scalar";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

type LHS = U;
type RHS = Blade;
type EXP = BCons<Sym, LHS, RHS>;

/**
 * Scalar * Blade => Scalar * Blade
 */
class Op extends Function2<LHS, Blade> implements Operator<EXP> {
    readonly hash: string;
    readonly phases = FOCUS_FLAGS_EXPANDING_UNION_FACTORING;
    constructor($: ExtensionEnv) {
        super('mul_2_scalar_blade', MATH_MUL, is_scalar($), is_blade, $);
        this.hash = hash_binop_atom_atom(MATH_MUL, HASH_ANY, HASH_BLADE);
    }
    isScalar(expr: EXP): boolean {
        return bitCount(expr.rhs.bitmap) === 0;
    }
    isVector(expr: EXP): boolean {
        return bitCount(expr.rhs.bitmap) === 1;
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS, expr: EXP): [TFLAGS, U] {
        return [TFLAG_NONE, expr];
    }
}

export const mul_2_scalar_blade = new Builder();
