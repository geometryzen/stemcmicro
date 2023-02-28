import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { HASH_RAT, hash_unaop_atom } from "../../hashing/hash_info";
import { Rat } from "../../tree/rat/Rat";
import { create_sym, Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { Function1 } from "../helpers/Function1";
import { UCons } from "../helpers/UCons";
import { is_rat } from "../rat/is_rat";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new SuccRat($);
    }
}

class SuccRat extends Function1<Rat> implements Operator<U> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('succ_rat', create_sym('succ'), is_rat, $);
        this.hash = hash_unaop_atom(this.opr, HASH_RAT);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, arg: Rat, expr: UCons<Sym, Rat>): [TFLAGS, U] {
        return [TFLAG_DIFF, arg.succ()];
    }
}

export const succ_rat = new Builder();
