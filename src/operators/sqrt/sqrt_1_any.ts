import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_unaop_atom } from "../../hashing/hash_info";
import { MATH_POW } from "../../runtime/ns_math";
import { half } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { items_to_cons, U } from "../../tree/tree";
import { Function1 } from "../helpers/Function1";
import { is_any } from "../helpers/is_any";
import { UCons } from "../helpers/UCons";
import { MATH_SQRT } from "./MATH_SQRT";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Sqrt($);
    }
}

type ARG = U;
type EXPR = UCons<Sym, ARG>;

/**
 * sqrt(x) => (expt x 1/2)
 */
class Sqrt extends Function1<ARG> implements Operator<EXPR> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('sqrt_1_any', MATH_SQRT, is_any, $);
        this.hash = hash_unaop_atom(this.opr, HASH_ANY);
    }
    transform1(opr: Sym, arg: ARG): [TFLAGS, U] {
        return [TFLAG_DIFF, this.$.valueOf(items_to_cons(MATH_POW, arg, half))];
    }
}

export const sqrt_1_any = new Builder();
