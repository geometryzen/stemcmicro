import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_unaop_atom } from "../../hashing/hash_info";
import { CLOCK } from "../../runtime/constants";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { Function1 } from "../helpers/Function1";
import { is_any } from "../helpers/is_any";
import { UCons } from "../helpers/UCons";
import { clockform } from "./clock";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

type ARG = U;
type EXP = UCons<Sym, ARG>;

class Op extends Function1<ARG> implements Operator<EXP> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('clock_any', CLOCK, is_any, $);
        this.hash = hash_unaop_atom(CLOCK, HASH_ANY);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, arg: ARG, oldExpr: EXP): [TFLAGS, U] {
        const $ = this.$;
        if ($.isExpanding()) {
            const newExpr = clockform(arg, $);
            return [TFLAG_DIFF, newExpr];
        }
        else {
            return [TFLAG_NONE, oldExpr];
        }
    }
}

export const clock_any = new Builder();
