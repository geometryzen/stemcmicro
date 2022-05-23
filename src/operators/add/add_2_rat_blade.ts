import { TFLAG_DIFF, ExtensionEnv, Operator, OperatorBuilder, TFLAG_HALT, TFLAGS } from "../../env/ExtensionEnv";
import { hash_binop_atom_atom, HASH_BLADE, HASH_RAT } from "../../hashing/hash_info";
import { MATH_ADD } from "../../runtime/ns_math";
import { is_rat } from "../../tree/rat/is_rat";
import { Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
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
type EXP = BCons<Sym, LHS, RHS>;

class Op extends Function2<LHS, RHS> implements Operator<EXP> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('add_2_rat_blade', MATH_ADD, is_rat, is_blade, $);
        this.hash = hash_binop_atom_atom(MATH_ADD, HASH_RAT, HASH_BLADE);
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS, expr: EXP): [TFLAGS, U] {
        if (lhs.isZero()) {
            return [TFLAG_DIFF, rhs];
        }
        else {
            // It's a multivector in canonical order.
            return [TFLAG_HALT, expr];
        }
    }
}

export const add_2_rat_blade = new Builder();
