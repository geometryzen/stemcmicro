import { TFLAG_DIFF, ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { Flt, wrap_as_flt } from "../../tree/flt/Flt";
import { is_flt } from "../flt/is_flt";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { Function1 } from "../helpers/Function1";
import { MATH_EXP } from "./MATH_EXP";
import { HASH_RAT, hash_unaop_atom } from "../../hashing/hash_info";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new ExpFlt($);
    }
}

class ExpFlt extends Function1<Flt> implements Operator<U> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('exp_flt', MATH_EXP, is_flt, $);
        this.hash = hash_unaop_atom(this.opr, HASH_RAT);
    }
    transform1(opr: Sym, arg: Flt): [TFLAGS, U] {
        return [TFLAG_DIFF, wrap_as_flt(Math.exp(arg.toNumber()))];
    }
}

export const exp_flt = new Builder();
