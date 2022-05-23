import { get_component } from "../../calculators/get_component";
import { TFLAG_DIFF, ExtensionEnv, NOFLAGS, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { hash_binop_atom_atom, HASH_RAT, HASH_TENSOR } from "../../hashing/hash_info";
import { SYM_MATH_COMPONENT } from "../../runtime/constants";
import { is_rat } from "../../tree/rat/is_rat";
import { Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { is_tensor } from "../../tree/tensor/is_tensor";
import { Tensor } from "../../tree/tensor/Tensor";
import { U } from "../../tree/tree";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

class Op extends Function2<Tensor, Rat> implements Operator<U> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('index_2_mat_rat', SYM_MATH_COMPONENT, is_tensor, is_rat, $);
        this.hash = hash_binop_atom_atom(SYM_MATH_COMPONENT, HASH_TENSOR, HASH_RAT);
    }
    transform2(opr: Sym, lhs: Tensor<U>, rhs: Rat, orig: BCons<Sym, Tensor<U>, Rat>): [TFLAGS, U] {
        const $ = this.$;
        const M = lhs;
        const iList = rhs;
        if (is_tensor(M)) {
            return [TFLAG_DIFF, get_component(M, iList, $)];
        }
        else {
            // The thing in the tensor position may well be just a symbol and so we can't dig into it yet.
            return [NOFLAGS, orig];
        }
    }
}

export const index_2_mat_rat = new Builder();
