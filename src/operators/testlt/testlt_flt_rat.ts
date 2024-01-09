import { Flt, is_flt, is_rat, Rat, Sym } from "math-expression-atoms";
import { Native, native_sym } from "math-expression-native";
import { U } from "math-expression-tree";
import { compare_num_num } from "../../calculators/compare/compare_num_num";
import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { hash_binop_atom_atom, HASH_FLT, HASH_RAT } from "../../hashing/hash_info";
import { predicate_return_value } from "../../helpers/predicate_return_value";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";

export const MATH_LT = native_sym(Native.testlt);

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

type LHS = Flt;
type RHS = Rat;
type EXPR = BCons<Sym, LHS, RHS>;

class Op extends Function2<LHS, RHS> implements Operator<EXPR> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('testlt_flt_rat', MATH_LT, is_flt, is_rat, $);
        this.hash = hash_binop_atom_atom(MATH_LT, HASH_FLT, HASH_RAT);
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS): [TFLAGS, U] {
        return [TFLAG_DIFF, predicate_return_value(compare_num_num(lhs, rhs) < 0, this.$)];
    }
}

export const testlt_flt_rat = new Builder();
