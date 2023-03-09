import { TFLAG_DIFF, ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { hash_binop_atom_atom, HASH_FLT, HASH_RAT } from "../../hashing/hash_info";
import { MATH_POW } from "../../runtime/ns_math";
import { create_flt, Flt } from "../../tree/flt/Flt";
import { Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { is_flt } from "../flt/flt_extension";
import { Function2 } from "../helpers/Function2";
import { is_rat } from "../rat/rat_extension";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

class Op extends Function2<Flt, Rat> implements Operator<Cons> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('pow_2_flt_rat', MATH_POW, is_flt, is_rat, $);
        this.hash = hash_binop_atom_atom(MATH_POW, HASH_FLT, HASH_RAT);
    }
    isScalar(): boolean {
        return true;
    }
    isVector(): boolean {
        return false;
    }
    transform2(opr: Sym, lhs: Flt, rhs: Rat): [TFLAGS, U] {
        return [TFLAG_DIFF, create_flt(Math.pow(lhs.d, rhs.toNumber()))];
    }
}

export const pow_2_flt_rat = new Builder();
