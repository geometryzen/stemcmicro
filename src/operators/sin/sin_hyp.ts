import { TFLAG_DIFF, ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { HASH_HYP, hash_unaop_atom } from "../../hashing/hash_info";
import { Hyp } from "../../tree/hyp/Hyp";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { Function1 } from "../helpers/Function1";
import { UCons } from "../helpers/UCons";
import { is_hyp } from "../hyp/is_hyp";
import { MATH_SIN } from "./MATH_SIN";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

type ARG = Hyp;
type EXP = UCons<Sym, ARG>;

/**
 * sin(Hyp) => Hyp
 */
class Op extends Function1<ARG> implements Operator<EXP> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('sin_hyp', MATH_SIN, is_hyp, $);
        this.hash = hash_unaop_atom(MATH_SIN, HASH_HYP);
    }
    transform1(opr: Sym, arg: ARG): [TFLAGS, U] {
        return [TFLAG_DIFF, arg];
    }
}

export const sin_hyp = new Builder();
