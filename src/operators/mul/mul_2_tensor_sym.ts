
import { ExtensionEnv, FEATURE, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { hash_binop_atom_atom, HASH_SYM, HASH_TENSOR } from "../../hashing/hash_info";
import { MATH_MUL } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { Tensor } from "../../tree/tensor/Tensor";
import { Cons, U } from "../../tree/tree";
import { BCons } from "../helpers/BCons";
import { Function2X } from "../helpers/Function2X";
import { is_sym } from "../sym/is_sym";
import { is_tensor } from "../tensor/is_tensor";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

type LHS = Tensor;
type RHS = Sym;
type EXP = BCons<Sym, LHS, RHS>

function cross($: ExtensionEnv) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return function (lhs: LHS, rhs: RHS): boolean {
        return $.isscalar(rhs);
    };
}

/**
 *
 */
class Op extends Function2X<LHS, RHS> implements Operator<EXP> {
    readonly #hash: string;
    readonly dependencies: FEATURE[] = [];
    constructor($: ExtensionEnv) {
        super('mul_2_tensor_sym', MATH_MUL, is_tensor, is_sym, cross($), $);
        this.#hash = hash_binop_atom_atom(MATH_MUL, HASH_TENSOR, HASH_SYM);
    }
    get hash(): string {
        return this.#hash;
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS): [TFLAGS, U] {
        const $ = this.$;
        const retval = lhs.map(function (value: U) {
            return $.multiply(value, rhs);
        });
        return [TFLAG_DIFF, retval];
    }
}

export const mul_2_tensor_sym = new Builder();
