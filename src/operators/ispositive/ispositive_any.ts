import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_unaop_atom } from "../../hashing/hash_info";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { booF } from "../../tree/boo/Boo";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { Function1 } from "../helpers/Function1";
import { is_any } from "../helpers/is_any";

export const ISPOS = native_sym(Native.ispositive);

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new IsRealAny($);
    }
}

class IsRealAny extends Function1<U> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('ispositive_any', ISPOS, is_any, $);
        this.hash = hash_unaop_atom(this.opr, HASH_ANY);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, arg: U, expr: U): [TFLAGS, U] {
        // We could use fuzzy logic here...
        return [TFLAG_DIFF, booF];
    }
}

export const ispositive_any = new Builder();
