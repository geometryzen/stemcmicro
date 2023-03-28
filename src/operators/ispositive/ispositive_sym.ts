import { ExtensionEnv, Operator, OperatorBuilder, Predicates, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { HASH_SYM, hash_unaop_atom } from "../../hashing/hash_info";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { create_boo } from "../../tree/boo/Boo";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { Function1 } from "../helpers/Function1";
import { is_sym } from "../sym/is_sym";

class Builder implements OperatorBuilder<U> {
    constructor(readonly predicate: Sym, readonly which: (predicates: Predicates) => boolean) {

    }
    create($: ExtensionEnv): Operator<U> {
        return new Op(this.predicate, this.which, $);
    }
}

class Op extends Function1<Sym> {
    readonly hash: string;
    constructor(readonly predicate: Sym, readonly which: (predicates: Predicates) => boolean, $: ExtensionEnv) {
        super("ispositive_sym", predicate, is_sym, $);
        this.hash = hash_unaop_atom(this.opr, HASH_SYM);
    }
    transform1(opr: Sym, arg: Sym): [TFLAGS, U] {
        const $ = this.$;
        const predicates = $.getSymbolPredicates(arg);
        return [TFLAG_DIFF, create_boo(this.which(predicates))];
    }
}

export const ispositive_sym = new Builder(native_sym(Native.ispositive), (predicates: Predicates) => predicates.positive);
