import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { HASH_BOO, HASH_SYM, hash_unaop_atom } from "../../hashing/hash_info";
import { create_boo } from "../../tree/boo/Boo";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { Function1 } from "../helpers/Function1";
import { is_sym } from "../sym/is_sym";

class Builder implements OperatorBuilder<U> {
    constructor(readonly predicate: Sym) {
    }
    create($: ExtensionEnv): Operator<U> {
        return new PredicateSym(this.predicate, $);
    }
}

class PredicateSym extends Function1<Sym> {
    readonly hash: string;
    constructor(predicate: Sym, $: ExtensionEnv) {
        super(`${predicate.text}(sym: ${HASH_SYM}) => ${HASH_BOO}`, predicate, is_sym, $);
        this.hash = hash_unaop_atom(this.opr, HASH_SYM);
    }
    transform1(opr: Sym, arg: Sym): [TFLAGS, U] {
        const $ = this.$;
        const props = $.getSymbolProps(arg);
        return [TFLAG_DIFF, create_boo(props.real)];
    }
}

export function make_predicate_sym_operator(predicate: Sym): OperatorBuilder<U> {
    return new Builder(predicate);
}
