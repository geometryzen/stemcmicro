import { TFLAG_DIFF, ExtensionEnv, FEATURE, Operator, OperatorBuilder, FOCUS_FLAGS_EXPANDING_UNION_FACTORING, TFLAGS } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_binop_atom_atom } from "../../hashing/hash_info";
import { MATH_ADD } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { Cons, items_to_cons, U } from "../../tree/tree";
import { BCons } from "../helpers/BCons";
import { Function2X } from "../helpers/Function2X";
import { is_any } from "../helpers/is_any";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

type LHS = U;
type RHS = U;
type EXP = BCons<Sym, LHS, RHS>;

function cross($: ExtensionEnv) {
    return function (lhs: LHS, rhs: RHS): boolean {
        return $.isImag(lhs) && $.isReal(rhs);
    };
}

/**
 * Imag + Real => Real + Imag
 */
class Op extends Function2X<LHS, RHS> implements Operator<EXP> {
    readonly hash: string;
    readonly phases = FOCUS_FLAGS_EXPANDING_UNION_FACTORING;
    readonly dependencies: FEATURE[] = ['Imu'];
    constructor($: ExtensionEnv) {
        super('add_2_imag_real', MATH_ADD, is_any, is_any, cross($), $);
        this.hash = hash_binop_atom_atom(MATH_ADD, HASH_ANY, HASH_ANY);
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS): [TFLAGS, U] {
        return [TFLAG_DIFF, items_to_cons(opr, rhs, lhs)];
    }
}

export const add_2_imag_real = new Builder();
