
import { ExtensionEnv, FEATURE, Operator, OperatorBuilder, TFLAGS, TFLAG_HALT } from "../../env/ExtensionEnv";
import { hash_binop_atom_atom, HASH_SYM } from "../../hashing/hash_info";
import { MATH_OUTER } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { Cons2 } from "../helpers/Cons2";
import { Function2 } from "../helpers/Function2";
import { is_sym } from "../sym/is_sym";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

class Op extends Function2<Sym, Sym> implements Operator<Cons2<Sym, Sym, Sym>> {
    readonly #hash: string;
    readonly dependencies: FEATURE[] = ['Sym'];
    constructor($: ExtensionEnv) {
        super('outer_2_sym_sym', MATH_OUTER, is_sym, is_sym, $);
        this.#hash = hash_binop_atom_atom(MATH_OUTER, HASH_SYM, HASH_SYM);
    }
    get hash(): string {
        return this.#hash;
    }
    transform2(opr: Sym, lhs: Sym, rhs: Sym, expr: Cons2<Sym, Sym, Sym>): [TFLAGS, U] {
        return [TFLAG_HALT, expr];
    }
}

export const outer_2_sym_sym = new Builder();
