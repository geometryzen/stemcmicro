import { CHANGED, ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { HASH_HYP, hash_unaop_atom } from "../../hashing/hash_info";
import { Hyp } from "../../tree/hyp/Hyp";
import { one } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { Function1 } from "../helpers/Function1";
import { UCons } from "../helpers/UCons";
import { is_hyp } from "../hyp/is_hyp";
import { MATH_COS } from "./MATH_COS";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

type ARG = Hyp;
type EXP = UCons<Sym, ARG>;

/**
 * cos(Hyp) => 1
 */
class Op extends Function1<ARG> implements Operator<EXP> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('cos_hyp', MATH_COS, is_hyp, $);
        this.hash = hash_unaop_atom(MATH_COS, HASH_HYP);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, arg: ARG): [TFLAGS, U] {
        return [CHANGED, one];
    }
}

export const cos_hyp = new Builder();
