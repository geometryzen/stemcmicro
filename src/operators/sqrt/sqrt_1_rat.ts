import { TFLAG_DIFF, ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { HASH_RAT, hash_unaop_atom } from "../../hashing/hash_info";
import { makeList } from "../../makeList";
import { MATH_POW } from "../../runtime/ns_math";
import { is_rat } from "../rat/is_rat";
import { half, Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { Function1 } from "../helpers/Function1";
import { MATH_SQRT } from "./MATH_SQRT";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new SqrtRat($);
    }
}

/**
 * sqrt(x: Rat) => (expt x 1/2)
 */
class SqrtRat extends Function1<Rat> implements Operator<Cons> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('sqrt_1_rat', MATH_SQRT, is_rat, $);
        this.hash = hash_unaop_atom(MATH_SQRT, HASH_RAT);
    }
    transform1(opr: Sym, arg: Rat): [TFLAGS, U] {
        return [TFLAG_DIFF, this.$.valueOf(makeList(MATH_POW, arg, half))];
    }
}

export const sqrt_1_rat = new Builder();
