import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { HASH_RAT, hash_unaop_atom } from "../../hashing/hash_info";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { Err } from "../../tree/err/Err";
import { Rat, zero } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { Function1 } from "../helpers/Function1";
import { UCons } from "../helpers/UCons";
import { is_rat } from "../rat/is_rat";

const ARG = native_sym(Native.arg);
const PI = native_sym(Native.PI);

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

type ARG = Rat;
type EXP = UCons<Sym, ARG>;

class Op extends Function1<ARG> implements Operator<EXP> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('arg_rat', ARG, is_rat, $);
        this.hash = hash_unaop_atom(this.opr, HASH_RAT);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, arg: ARG, expr: EXP): [TFLAGS, U] {
        if (arg.isZero()) {
            return [TFLAG_DIFF, new Err(expr)];
        }
        else if (arg.isNegative()) {
            return [TFLAG_DIFF, PI];
        }
        else {
            return [TFLAG_DIFF, zero];
        }
    }
}

export const arg_rat = new Builder();
