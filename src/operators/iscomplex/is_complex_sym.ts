import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { HASH_SYM, hash_unaop_atom } from "../../hashing/hash_info";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { create_boo } from "../../tree/boo/Boo";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { Function1 } from "../helpers/Function1";
import { is_sym } from "../sym/is_sym";

export const IS_COMPLEX = native_sym(Native.is_complex);

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

type ARG = Sym;

class Op extends Function1<ARG> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('is_complex_sym', IS_COMPLEX, is_sym, $);
        this.hash = hash_unaop_atom(this.opr, HASH_SYM);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, arg: ARG): [TFLAGS, U] {
        const $ = this.$;
        const props = $.getSymbolProps(arg);
        return [TFLAG_DIFF, create_boo(props.complex)];
    }
}

export const is_complex_sym = new Builder();
