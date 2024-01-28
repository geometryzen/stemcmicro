import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_unaop_atom } from "../../hashing/hash_info";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { Function1 } from "../helpers/Function1";
import { is_any } from "../helpers/is_any";
import { Cons1 } from "../helpers/Cons1";
import { clock } from "./clock";

export const CLOCK = native_sym(Native.clock);

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

type ARG = U;
type EXP = Cons1<Sym, ARG>;

class Op extends Function1<ARG> {
    readonly #hash: string;
    constructor($: ExtensionEnv) {
        super('clock_any', CLOCK, is_any, $);
        this.#hash = hash_unaop_atom(CLOCK, HASH_ANY);
    }
    get hash(): string {
        return this.#hash;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, arg: ARG, oldExpr: EXP): [TFLAGS, U] {
        // console.lg(this.name, this.$.toInfixString(arg));
        const $ = this.$;
        if ($.isExpanding()) {
            const newExpr = clock(arg, $);
            return [TFLAG_DIFF, newExpr];
        }
        else {
            return [TFLAG_NONE, oldExpr];
        }
    }
}

export const clock_any = new Builder();
