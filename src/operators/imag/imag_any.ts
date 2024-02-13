import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_NONE } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_unaop_atom } from "../../hashing/hash_info";
import { IMAG } from "../../runtime/constants";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { Function1 } from "../helpers/Function1";
import { is_any } from "../helpers/is_any";
import { Cons1 } from "../helpers/Cons1";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

type ARG = U;
type EXP = Cons1<Sym, ARG>;


class Op extends Function1<ARG> implements Operator<EXP> {
    readonly #hash: string;
    constructor($: ExtensionEnv) {
        super('imag', IMAG, is_any, $);
        this.#hash = hash_unaop_atom(this.opr, HASH_ANY);
    }
    get hash(): string {
        return this.#hash;
    }
    transform1(opr: Sym, arg: ARG, expr: EXP): [TFLAGS, U] {
        return [TFLAG_NONE, expr];
        /*
        // console.lg(this.name, this.$.toInfixString(arg));
        const $ = this.$;
        const retval = im(arg, $);
        const changed = !retval.equals(expr);
        return [changed ? TFLAG_DIFF : TFLAG_NONE, retval];
        */
    }
}

export const imag_any = new Builder();
