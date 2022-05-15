
import { CHANGED, ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { hash_binop_atom_atom, HASH_RAT } from "../../hashing/hash_info";
import { MATH_MUL } from "../../runtime/ns_math";
import { is_rat } from "../../tree/rat/is_rat";
import { Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { Function2 } from "../helpers/Function2";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

class Op extends Function2<Rat, Rat> implements Operator<Cons> {
    readonly breaker = true;
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('mul_2_rat_rat', MATH_MUL, is_rat, is_rat, $);
        this.hash = hash_binop_atom_atom(MATH_MUL, HASH_RAT, HASH_RAT);
    }
    transform2(opr: Sym, lhs: Rat, rhs: Rat): [TFLAGS, U] {
        return [CHANGED, lhs.mul(rhs)];
    }
}

export const mul_2_rat_rat = new Builder();
