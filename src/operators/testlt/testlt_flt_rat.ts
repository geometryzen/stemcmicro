import { compare_num_num } from "../../calculators/compare/compare_num_num";
import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { hash_binop_atom_atom, HASH_FLT, HASH_RAT } from "../../hashing/hash_info";
import { predicate_return_value } from "../../helpers/predicate_return_value";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { Flt } from "../../tree/flt/Flt";
import { Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { is_flt } from "../flt/flt_extension";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { is_rat } from "../rat/is_rat";

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
