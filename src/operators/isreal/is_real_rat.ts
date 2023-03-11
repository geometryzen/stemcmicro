import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { HASH_RAT, hash_unaop_atom } from "../../hashing/hash_info";
import { PREDICATE_IS_REAL } from "../../runtime/constants";
import { booT } from "../../tree/boo/Boo";
import { Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { Function1 } from "../helpers/Function1";
import { is_rat } from "../rat/is_rat";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new IsRealRat($);
    }
}

type ARG = Rat;

class IsRealRat extends Function1<ARG> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('is_real_rat', PREDICATE_IS_REAL, is_rat, $);
        this.hash = hash_unaop_atom(this.opr, HASH_RAT);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, arg: ARG): [TFLAGS, U] {
        return [TFLAG_DIFF, booT];
    }
}

export const is_real_rat = new Builder();
