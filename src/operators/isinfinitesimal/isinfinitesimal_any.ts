import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_NONE } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_unaop_atom } from "../../hashing/hash_info";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { Function1 } from "../helpers/Function1";
import { is_any } from "../helpers/is_any";

export const ISINFINITESIMAL = native_sym(Native.isinfinitesimal);

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

class Op extends Function1<U> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('isinfinitesimal_any', ISINFINITESIMAL, is_any, $);
        this.hash = hash_unaop_atom(this.opr, HASH_ANY);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, arg: U, expr: U): [TFLAGS, U] {
        // console.lg(this.name, this.$.toInfixString(arg));
        // We could use fuzzy logic here...
        return [TFLAG_NONE, expr];
    }
}

export const isinfinitesimal_any = new Builder();
