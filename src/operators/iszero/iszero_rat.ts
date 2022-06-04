import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { HASH_RAT, hash_unaop_atom } from "../../hashing/hash_info";
import { booF, booT } from "../../tree/boo/Boo";
import { is_rat } from "../rat/is_rat";
import { Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { Function1 } from "../helpers/Function1";

class ExpRatBuilder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new IsZeroRat($);
    }
}

const ISZERO = new Sym('iszero');

class IsZeroRat extends Function1<Rat> implements Operator<U> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('iszero_rat', ISZERO, is_rat, $);
        this.hash = hash_unaop_atom(this.opr, HASH_RAT);
    }
    transform1(opr: Sym, arg: Rat): [TFLAGS, U] {
        return [TFLAG_DIFF, arg.isZero() ? booT : booF];
    }
}

export const iszero_rat = new ExpRatBuilder();
