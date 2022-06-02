import { ExtensionEnv, TFLAG_NONE, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_binop_atom_atom, HASH_RAT } from "../../hashing/hash_info";
import { MATH_POW } from "../../runtime/ns_math";
import { Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, U } from "../../tree/tree";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { is_rat } from "../rat/RatExtension";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new PowerConsRat($);
    }
}

class PowerConsRat extends Function2<Cons, Rat> implements Operator<Cons> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('pow_2_cons_rat', MATH_POW, is_cons, is_rat, $);
        this.hash = hash_binop_atom_atom(this.opr, HASH_ANY, HASH_RAT);
    }
    transform2(opr: Sym, lhs: Cons, rhs: Rat, expr: BCons<Sym, Cons, Rat>): [TFLAGS, U] {
        return [TFLAG_NONE, expr];
    }
}

export const pow_2_cons_rat = new Builder();
