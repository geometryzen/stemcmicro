import { is_rat, is_uom, QQ, Rat, Sym, Uom } from "math-expression-atoms";
import { Cons, U } from "math-expression-tree";
import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { hash_binop_atom_atom, HASH_RAT, HASH_UOM } from "../../hashing/hash_info";
import { MATH_POW } from "../../runtime/ns_math";
import { Function2 } from "../helpers/Function2";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

class Op extends Function2<Uom, Rat> implements Operator<Cons> {
    readonly #hash: string;
    constructor($: ExtensionEnv) {
        super('pow_2_uom_rat', MATH_POW, is_uom, is_rat, $);
        this.#hash = hash_binop_atom_atom(MATH_POW, HASH_UOM, HASH_RAT);
    }
    get hash(): string {
        return this.#hash;
    }
    transform2(opr: Sym, lhs: Uom, rhs: Rat): [TFLAGS, U] {
        const expo = QQ.valueOf(rhs.numer().toNumber(), rhs.denom().toNumber());
        return [TFLAG_DIFF, lhs.pow(expo)];
    }
}

export const pow_2_uom_rat = new Builder();
