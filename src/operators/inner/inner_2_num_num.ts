
import { multiply_num_num } from "../../calculators/mul/multiply_num_num";
import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { hash_binop_atom_atom, HASH_RAT } from "../../hashing/hash_info";
import { MATH_INNER } from "../../runtime/ns_math";
import { Num } from "../../tree/num/Num";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { Function2 } from "../helpers/Function2";
import { is_num } from "../num/is_num";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

/**
 * Num | Num => Num * Num
 */
class Op extends Function2<Num, Num> implements Operator<Cons> {
    readonly #hash: string;
    constructor($: ExtensionEnv) {
        super('inner_2_num_num', MATH_INNER, is_num, is_num, $);
        this.#hash = hash_binop_atom_atom(MATH_INNER, HASH_RAT, HASH_RAT);
    }
    get hash(): string {
        return this.#hash;
    }
    transform2(opr: Sym, lhs: Num, rhs: Num): [TFLAGS, U] {
        return [TFLAG_DIFF, multiply_num_num(lhs, rhs)];
    }
}

export const inner_2_num_num = new Builder();
