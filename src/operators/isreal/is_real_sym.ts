import { create_boo, is_sym, Sym } from "math-expression-atoms";
import { Cons1, U } from "math-expression-tree";
import { Extension, ExtensionBuilder, ExtensionEnv, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { HASH_BOO, HASH_SYM, hash_unaop_atom } from "../../hashing/hash_info";
import { Function1 } from "../helpers/Function1";

type ARG = Sym;
type EXP = Cons1<Sym, ARG>;

class Builder implements ExtensionBuilder<EXP> {
    constructor(readonly predicate: Sym) {
    }
    create(): Extension<EXP> {
        return new PredicateSym(this.predicate);
    }
}

class PredicateSym extends Function1<Sym> {
    readonly #hash: string;
    constructor(predicate: Sym) {
        super(`${predicate.key()}(sym: ${HASH_SYM}) => ${HASH_BOO}`, predicate, is_sym);
        this.#hash = hash_unaop_atom(this.opr, HASH_SYM);
    }
    get hash(): string {
        return this.#hash;
    }
    transform1(opr: Sym, arg: Sym, expr: EXP, $: ExtensionEnv): [TFLAGS, U] {
        const props = $.getSymbolPredicates(arg);
        return [TFLAG_DIFF, create_boo(props.real)];
    }
}

/**
 * Constructs an operator for predicate(arg: Sym). 
 */
export function make_predicate_sym_extension(predicate: Sym): ExtensionBuilder<EXP> {
    return new Builder(predicate);
}
