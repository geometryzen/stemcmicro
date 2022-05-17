
import { CHANGED, ExtensionEnv, FEATURE, Operator, OperatorBuilder, STABLE, TFLAGS } from "../../env/ExtensionEnv";
import { hash_binop_atom_atom, HASH_BLADE, HASH_RAT } from "../../hashing/hash_info";
import { MATH_MUL } from "../../runtime/ns_math";
import { is_rat } from "../../tree/rat/is_rat";
import { Rat, zero } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { bitCount } from "../../tree/vec/bitCount";
import { Blade } from "../../tree/vec/Blade";
import { is_blade } from "../blade/BladeExtension";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

type LHS = Rat;
type RHS = Blade;
type EXP = BCons<Sym, LHS, RHS>

/**
 * (* Rat Blade) => (* Rat Blade) STABLE
 *               => 0 if Rat is zero
 *               => Blade if Rat is one
 */
class Op extends Function2<LHS, RHS> implements Operator<EXP> {
    readonly hash: string;
    readonly dependencies: FEATURE[] = ['Blade'];
    constructor($: ExtensionEnv) {
        super('mul_2_rat_blade', MATH_MUL, is_rat, is_blade, $);
        this.hash = hash_binop_atom_atom(MATH_MUL, HASH_RAT, HASH_BLADE);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isScalar(expr: EXP): boolean {
        return false;
    }
    isVector(expr: EXP): boolean {
        return bitCount(expr.rhs.bitmap) === 1;
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS, expr: EXP): [TFLAGS, U] {
        // The following code is common
        if (lhs.isZero()) {
            return [CHANGED, zero];
        }
        if (lhs.isOne()) {
            return [CHANGED, rhs];
        }
        return [STABLE, expr];
    }
}

export const mul_2_rat_blade = new Builder();
