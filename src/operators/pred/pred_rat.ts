import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { HASH_RAT, hash_unaop_atom } from "../../hashing/hash_info";
import { is_rat } from "../rat/is_rat";
import { Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { Function1 } from "../helpers/Function1";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new PredRat($);
    }
}

class PredRat extends Function1<Rat> implements Operator<U> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('pred_rat', new Sym('pred'), is_rat, $);
        this.hash = hash_unaop_atom(this.opr, HASH_RAT);
    }
    transform1(opr: Sym, arg: Rat): [TFLAGS, U] {
        return [TFLAG_DIFF, arg.pred()];
    }
}

export const pred_rat = new Builder();
