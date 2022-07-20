
import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { hash_binop_atom_atom, HASH_RAT, HASH_TENSOR } from "../../hashing/hash_info";
import { MATH_MUL } from "../../runtime/ns_math";
import { Rat, zero } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Tensor } from "../../tree/tensor/Tensor";
import { Cons, U } from "../../tree/tree";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { is_rat } from "../rat/is_rat";
import { is_tensor } from "../tensor/is_tensor";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

type LHS = Rat;
type RHS = Tensor;
type EXP = BCons<Sym, LHS, RHS>

/**
 * (* Rat Sym) => (* Rat Sym) STABLE
 *             => 0 if Rat is zero
 *             => Sym if Rat is one
 */
class Op extends Function2<LHS, RHS> implements Operator<EXP> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('mul_2_rat_tensor', MATH_MUL, is_rat, is_tensor, $);
        this.hash = hash_binop_atom_atom(MATH_MUL, HASH_RAT, HASH_TENSOR);
    }
    /*
    isReal(expr: EXP): boolean {
        return this.$.isReal(expr.rhs);
    }
    isImag(expr: EXP): boolean {
        return this.$.isImag(expr.rhs);
    }
    isScalar(expr: EXP): boolean {
        return this.$.isScalar(expr.rhs);
    }
    isVector(expr: EXP): boolean {
        return this.$.isVector(expr.rhs);
    }
    */
    transform2(opr: Sym, lhs: LHS, rhs: RHS): [TFLAGS, U] {
        const $ = this.$;
        if (lhs.isZero()) {
            return [TFLAG_DIFF, zero];
        }
        if (lhs.isOne()) {
            return [TFLAG_DIFF, rhs];
        }
        const retval = rhs.map(function (value: U) {
            return $.multiply(lhs, value);
        });
        return [TFLAG_DIFF, retval];
    }
}

export const mul_2_rat_tensor = new Builder();
