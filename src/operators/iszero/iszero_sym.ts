import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { HASH_SYM, hash_unaop_atom } from "../../hashing/hash_info";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { booF, booT } from "../../tree/boo/Boo";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { Function1 } from "../helpers/Function1";
import { is_sym } from "../sym/is_sym";

class ExpRatBuilder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

const ISZERO = native_sym(Native.iszero);

class Op extends Function1<Sym> implements Operator<U> {
    readonly #hash: string;
    constructor($: ExtensionEnv) {
        super('iszero_sym', ISZERO, is_sym, $);
        this.#hash = hash_unaop_atom(this.opr, HASH_SYM);
    }
    get hash(): string {
        return this.#hash;
    }
    transform1(opr: Sym, arg: Sym): [TFLAGS, U] {
        // console.lg(this.name, this.$.toInfixString(arg));
        const $ = this.$;
        const predicates = $.getSymbolPredicates(arg);
        return [TFLAG_DIFF, predicates.zero ? booT : booF];
    }
}

export const iszero_sym = new ExpRatBuilder();
