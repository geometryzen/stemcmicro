import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_NONE } from "../../env/ExtensionEnv";
import { HASH_SYM, hash_unaop_atom } from "../../hashing/hash_info";
import { REAL } from "../../runtime/constants";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { Function1 } from "../helpers/Function1";
import { UCons } from "../helpers/UCons";
import { is_sym } from "../sym/is_sym";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

type ARG = Sym;
type EXP = UCons<Sym, ARG>;

class Op extends Function1<ARG> implements Operator<EXP> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('real', REAL, is_sym, $);
        this.hash = hash_unaop_atom(this.opr, HASH_SYM);
    }
    transform1(opr: Sym, arg: ARG, expr: EXP): [TFLAGS, U] {
        const $ = this.$;
        if ($.isreal(arg)) {
            return [TFLAG_NONE, arg];
        }
        else {
            return [TFLAG_NONE, expr];
        }
    }
}

export const real_sym = new Builder();
