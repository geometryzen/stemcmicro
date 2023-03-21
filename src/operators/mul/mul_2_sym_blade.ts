
import { ExtensionEnv, FEATURE, Operator, OperatorBuilder, TFLAGS, TFLAG_HALT } from "../../env/ExtensionEnv";
import { hash_binop_atom_atom, HASH_BLADE, HASH_SYM } from "../../hashing/hash_info";
import { MATH_MUL } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { Blade } from "../../tree/vec/Blade";
import { is_blade } from "../blade/is_blade";
import { BCons } from "../helpers/BCons";
import { Function2X } from "../helpers/Function2X";
import { is_sym } from "../sym/is_sym";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

type LHS = Sym;
type RHS = Blade;
type EXP = BCons<Sym, LHS, RHS>

function cross($: ExtensionEnv) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return function (lhs: LHS, rhs: RHS): boolean {
        return $.isscalar(lhs);
    };
}

/**
 * Sym * Blade => Sym * Blade (STABLE)
 */
class Op extends Function2X<LHS, RHS> implements Operator<EXP> {
    readonly hash: string;
    readonly dependencies: FEATURE[] = ['Blade'];
    constructor($: ExtensionEnv) {
        super('mul_2_sym_blade', MATH_MUL, is_sym, is_blade, cross($), $);
        this.hash = hash_binop_atom_atom(MATH_MUL, HASH_SYM, HASH_BLADE);
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS, orig: EXP): [TFLAGS, U] {
        // TODO: Be aware that this may prevent the processing of Sym * Blade more generally.
        return [TFLAG_HALT, orig];
    }
}

export const mul_2_sym_blade = new Builder();
