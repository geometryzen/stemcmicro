
import { compare_sym_sym } from "../../calculators/compare/compare_sym_sym";
import { TFLAG_DIFF, ExtensionEnv, TFLAG_NONE, Operator, OperatorBuilder, SIGN_GT, TFLAGS } from "../../env/ExtensionEnv";
import { MATH_MUL, MATH_OUTER } from "../../runtime/ns_math";
import { negOne } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, makeList, U } from "../../tree/tree";
import { BCons } from "../helpers/BCons";
import { Function2X } from "../helpers/Function2X";
import { is_sym } from "../sym/is_sym";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

function cross($: ExtensionEnv) {
    return function (lhs: Sym, rhs: Sym): boolean {
        return $.treatAsVector(lhs) && $.treatAsVector(rhs);
    };
}

class Op extends Function2X<Sym, Sym> implements Operator<Cons> {
    constructor($: ExtensionEnv) {
        super('outer_2_sym_sym_vector_antisymmetry', MATH_OUTER, is_sym, is_sym, cross($), $);
    }
    transform2(opr: Sym, lhs: Sym, rhs: Sym, oldExpr: BCons<Sym, Sym, Sym>): [TFLAGS, U] {
        switch (compare_sym_sym(lhs, rhs)) {
            case SIGN_GT: {
                return [TFLAG_DIFF, makeList(MATH_MUL, negOne, makeList(opr, rhs, lhs))];
            }
            default: {
                return [TFLAG_NONE, oldExpr];
            }
        }
    }
}

export const outer_2_sym_sym_vector_antisymmetry = new Builder();
