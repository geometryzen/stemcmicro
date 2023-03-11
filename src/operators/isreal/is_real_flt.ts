import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { HASH_BOO, HASH_FLT, hash_unaop_atom } from "../../hashing/hash_info";
import { PREDICATE_IS_REAL } from "../../runtime/constants";
import { booT } from "../../tree/boo/Boo";
import { Flt } from "../../tree/flt/Flt";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { is_flt } from "../flt/is_flt";
import { Function1 } from "../helpers/Function1";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new IsRealFlt($);
    }
}

class IsRealFlt extends Function1<Flt> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super(`${PREDICATE_IS_REAL.text}(expr: ${HASH_FLT}) => ${HASH_BOO}`, PREDICATE_IS_REAL, is_flt, $);
        this.hash = hash_unaop_atom(this.opr, HASH_FLT);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, arg: Flt): [TFLAGS, U] {
        return [TFLAG_DIFF, booT];
    }
}

export const is_real_flt = new Builder();
