
import { ExtensionEnv, FEATURE, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { hash_binop_atom_atom, HASH_BLADE, HASH_SYM } from "../../hashing/hash_info";
import { makeList } from "../../makeList";
import { MATH_MUL } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { Blade } from "../../tree/vec/Blade";
import { is_blade } from "../blade/is_blade";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { is_sym } from "../sym/is_sym";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

type LHS = Blade;
type RHS = Sym;
type EXPR = BCons<Sym, LHS, RHS>

/**
 * Blade * Sym => Sym * Blade
 */
class Op extends Function2<LHS, RHS> implements Operator<EXPR> {
    readonly hash: string;
    // The Not Vector is saying that we would like to assume that symbols represent real numbers.
    readonly dependencies: FEATURE[] = ['Blade', '~Vector'];
    constructor($: ExtensionEnv) {
        super('mul_2_blade_sym', MATH_MUL, is_blade, is_sym, $);
        this.hash = hash_binop_atom_atom(MATH_MUL, HASH_BLADE, HASH_SYM);
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS): [TFLAGS, U] {
        return [TFLAG_DIFF, makeList(opr, rhs, lhs)];
    }
}

export const mul_2_blade_sym = new Builder();
