
import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { hash_binop_atom_atom, HASH_TENSOR } from "../../hashing/hash_info";
import { MATH_ADD } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { Tensor } from "../../tree/tensor/Tensor";
import { Cons, U } from "../../tree/tree";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { is_tensor } from "../tensor/is_tensor";
import { add_tensor_tensor } from "../tensor/tensor_extension";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}
type LHS = Tensor;
type RHS = Tensor;
type EXP = BCons<Sym, LHS, RHS>;

/**
 * Tensor + Tensor => Tensor
 */
class Op extends Function2<LHS, RHS> implements Operator<EXP> {
    readonly breaker = true;
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('add_2_tensor_tensor', MATH_ADD, is_tensor, is_tensor, $);
        this.hash = hash_binop_atom_atom(MATH_ADD, HASH_TENSOR, HASH_TENSOR);
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS): [TFLAGS, U] {
        const $ = this.$;
        return [TFLAG_DIFF, add_tensor_tensor(lhs, rhs, $)];
    }
}

export const add_2_tensor_tensor = new Builder();
