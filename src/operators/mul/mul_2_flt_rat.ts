
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

class Op extends Function2<Flt, Rat> implements Operator<Cons> {
    readonly hash: string;
    readonly dependencies: FEATURE[] = ['Flt'];
    constructor($: ExtensionEnv) {
        super('mul_2_flt_rat', MATH_MUL, is_flt, is_rat, $);
        this.hash = hash_binop_atom_atom(MATH_MUL, HASH_FLT, HASH_RAT);
    }
    transform2(opr: Sym, lhs: Flt, rhs: Rat): [TFLAGS, U] {
        return [TFLAG_DIFF, create_flt(lhs.toNumber() * rhs.toNumber())];
    }
}

export const mul_2_flt_rat = new Builder();
