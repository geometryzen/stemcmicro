import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { HASH_FLT, hash_unaop_atom } from "../../hashing/hash_info";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { Err } from "../../tree/err/Err";
import { Flt, piAsFlt, zeroAsFlt } from "../../tree/flt/Flt";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { is_flt } from "../flt/is_flt";
import { Function1 } from "../helpers/Function1";
import { UCons } from "../helpers/UCons";

const ARG = native_sym(Native.arg);

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

type ARG = Flt;
type EXP = UCons<Sym, ARG>;

class Op extends Function1<ARG> implements Operator<EXP> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('arg_flt', ARG, is_flt, $);
        this.hash = hash_unaop_atom(this.opr, HASH_FLT);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, arg: ARG, expr: EXP): [TFLAGS, U] {
        if (arg.isZero()) {
            return [TFLAG_DIFF, new Err(expr)];
        }
        else if (arg.isNegative()) {
            return [TFLAG_DIFF, piAsFlt];
        }
        else {
            return [TFLAG_DIFF, zeroAsFlt];
        }
    }
}

export const arg_flt = new Builder();
