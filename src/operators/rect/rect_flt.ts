import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { HASH_FLT, hash_unaop_atom } from "../../hashing/hash_info";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { Flt } from "../../tree/flt/Flt";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { is_flt } from "../flt/is_flt";
import { Function1 } from "../helpers/Function1";

const RECT = native_sym(Native.rect);

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

class Op extends Function1<Flt> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('rect_flt', RECT, is_flt, $);
        this.hash = hash_unaop_atom(this.opr, HASH_FLT);
    }
    transform1(opr: Sym, arg: Flt): [TFLAGS, U] {
        return [TFLAG_DIFF, arg];
    }
}

export const rect_flt = new Builder();
