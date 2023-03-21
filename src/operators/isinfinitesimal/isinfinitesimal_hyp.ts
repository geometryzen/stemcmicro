import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { HASH_HYP, hash_unaop_atom } from "../../hashing/hash_info";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { booT } from "../../tree/boo/Boo";
import { Hyp } from "../../tree/hyp/Hyp";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { Function1 } from "../helpers/Function1";
import { is_hyp } from "../hyp/is_hyp";

const ISINFINITESIMAL = native_sym(Native.isinfinitesimal);

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

class Op extends Function1<Hyp> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('infinitesimal_hyp', ISINFINITESIMAL, is_hyp, $);
        this.hash = hash_unaop_atom(this.opr, HASH_HYP);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, arg: Hyp): [TFLAGS, U] {
        return [TFLAG_DIFF, booT];
    }
}

export const isinfinitesimal_hyp = new Builder();
