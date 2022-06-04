import { ExtensionEnv, Operator, OperatorBuilder, SIGN_EQ, SIGN_GT, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { hash_binop_atom_atom, HASH_BLADE } from "../../hashing/hash_info";
import { makeList } from "../../makeList";
import { MATH_ADD, MATH_MUL } from "../../runtime/ns_math";
import { two } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { Blade } from "../../tree/vec/Blade";
import { compare_blade_blade } from "../blade/BladeExtension";
import { is_blade } from "../blade/is_blade";
import { BCons } from "../helpers/BCons";
import { Function2X } from "../helpers/Function2X";

type LHS = Blade;
type RHS = Blade;
type EXPR = BCons<Sym, LHS, RHS>;

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

function cross(lhs: LHS, rhs: RHS): boolean {
    switch (compare_blade_blade(lhs, rhs)) {
        case SIGN_GT:
        case SIGN_EQ: {
            return true;
        }
        default: {
            return false;
        }
    }
}

/**
 * Blade + Blade
 */
class Op extends Function2X<LHS, RHS> implements Operator<EXPR> {
    readonly breaker = true;
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('add_2_blade_blade', MATH_ADD, is_blade, is_blade, cross, $);
        this.hash = hash_binop_atom_atom(MATH_ADD, HASH_BLADE, HASH_BLADE);
    }
    transform2(opr: Sym, lhs: LHS, rhs: LHS): [TFLAGS, U] {
        if (lhs.equals(rhs)) {
            return [TFLAG_DIFF, makeList(MATH_MUL, two, lhs)];
        }
        else {
            // We are here because the blades are not in canonical order.
            return [TFLAG_DIFF, makeList(opr, rhs, lhs)];
        }
    }
}

export const add_2_blade_blade = new Builder();
