
import { TFLAG_DIFF, ExtensionEnv, FEATURE, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { hash_binop_atom_atom, HASH_FLT, HASH_RAT } from "../../hashing/hash_info";
import { MATH_MUL } from "../../runtime/ns_math";
import { Flt, create_flt } from "../../tree/flt/Flt";
import { is_flt } from "../flt/is_flt";
import { is_rat } from "../rat/is_rat";
import { Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { Function2 } from "../helpers/Function2";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

/**
 * (Rat * Flt) => Flt
 */
class Op extends Function2<Rat, Flt> implements Operator<Cons> {
    readonly #hash: string;
    readonly dependencies: FEATURE[] = ['Flt'];
    constructor($: ExtensionEnv) {
        super('mul_2_rat_flt', MATH_MUL, is_rat, is_flt, $);
        this.#hash = hash_binop_atom_atom(MATH_MUL, HASH_RAT, HASH_FLT);
    }
    get hash(): string {
        return this.#hash;
    }
    transform2(opr: Sym, lhs: Rat, rhs: Flt): [TFLAGS, U] {
        return [TFLAG_DIFF, create_flt(lhs.toNumber() * rhs.toNumber())];
    }
}

export const mul_2_rat_flt = new Builder();
