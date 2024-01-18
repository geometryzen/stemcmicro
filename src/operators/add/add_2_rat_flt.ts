
import { ExtensionEnv, FEATURE, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { hash_binop_atom_atom, HASH_FLT, HASH_RAT } from "../../hashing/hash_info";
import { MATH_ADD } from "../../runtime/ns_math";
import { create_flt, Flt } from "../../tree/flt/Flt";
import { Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { is_flt } from "../flt/is_flt";
import { Function2 } from "../helpers/Function2";
import { is_rat } from "../rat/is_rat";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

/**
 * Rat + Flt => Flt
 */
class Op extends Function2<Rat, Flt> implements Operator<Cons> {
    readonly #hash: string;
    readonly dependencies: FEATURE[] = ['Flt', 'Rat'];
    constructor($: ExtensionEnv) {
        super('add_rat_flt', MATH_ADD, is_rat, is_flt, $);
        this.#hash = hash_binop_atom_atom(MATH_ADD, HASH_RAT, HASH_FLT);
    }
    get hash(): string {
        return this.#hash;
    }
    transform2(opr: Sym, lhs: Rat, rhs: Flt): [TFLAGS, U] {
        const lhsNum = lhs.toNumber();
        const rhsNum = rhs.toNumber();
        return [TFLAG_DIFF, create_flt(lhsNum + rhsNum)];
    }
}

export const add_2_rat_flt = new Builder();
