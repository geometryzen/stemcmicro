
import { Blade, is_blade } from "math-expression-atoms";
import { ExtensionEnv, FEATURE, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { hash_binop_atom_atom, HASH_BLADE, HASH_RAT } from "../../hashing/hash_info";
import { items_to_cons } from "../../makeList";
import { MATH_MUL } from "../../runtime/ns_math";
import { Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { is_rat } from "../rat/is_rat";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

type LHS = Blade;
type RHS = Rat;
type EXP = BCons<Sym, LHS, RHS>;

/**
 * Blade * Rat => Rat * Blade
 */
class Op extends Function2<LHS, RHS> implements Operator<EXP> {
    readonly hash: string;
    readonly dependencies: FEATURE[] = ['Blade'];
    constructor($: ExtensionEnv) {
        super('mul_2_blade_rat', MATH_MUL, is_blade, is_rat, $);
        this.hash = hash_binop_atom_atom(MATH_MUL, HASH_BLADE, HASH_RAT);
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS): [TFLAGS, U] {
        const $ = this.$;
        return [TFLAG_DIFF, $.valueOf(items_to_cons(opr, rhs, lhs))];
    }
}

export const mul_2_blade_rat = new Builder();
