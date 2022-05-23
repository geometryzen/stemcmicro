
import { compare_sym_sym } from "../../calculators/compare/compare_sym_sym";
import { TFLAG_DIFF, ExtensionEnv, FEATURE, Operator, OperatorBuilder, SIGN_GT, TFLAG_HALT, TFLAGS } from "../../env/ExtensionEnv";
import { hash_binop_atom_atom, HASH_SYM } from "../../hashing/hash_info";
import { MATH_OUTER } from "../../runtime/ns_math";
import { zero } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, makeList, U } from "../../tree/tree";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { value_of } from "../helpers/valueOf";
import { is_sym } from "../sym/is_sym";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

class Op extends Function2<Sym, Sym> implements Operator<BCons<Sym, Sym, Sym>> {
    readonly hash: string;
    readonly dependencies: FEATURE[] = ['Vector'];
    constructor($: ExtensionEnv) {
        super('outer_2_sym_sym', MATH_OUTER, is_sym, is_sym, $);
        this.hash = hash_binop_atom_atom(MATH_OUTER, HASH_SYM, HASH_SYM);
    }
    transform2(opr: Sym, lhs: Sym, rhs: Sym, expr: BCons<Sym, Sym, Sym>): [TFLAGS, U] {
        const $ = this.$;
        if ($.treatAsScalar(lhs)) {
            if ($.treatAsScalar(rhs)) {
                // scalar ^ scalar
                return [TFLAG_HALT, expr];
            }
            else if ($.treatAsVector(rhs)) {
                // scalar ^ vector
                return [TFLAG_HALT, expr];
            }
            else {
                // scalar ^ other
                return [TFLAG_HALT, expr];
            }
        }
        else if ($.treatAsVector(lhs)) {
            if ($.treatAsScalar(rhs)) {
                // vector ^ scalar
                return [TFLAG_HALT, expr];
            }
            else if ($.treatAsVector(rhs)) {
                // vector ^ vector
                if (lhs.equals(rhs)) {
                    return [TFLAG_DIFF, zero];
                }
                // How, and under what circumestances do we propose 1/2*(ab-ba)?
                // This will conflict with expanding the geometric product.
                /*
                const a = lhs;
                const b = rhs;
                const ab = makeList(MATH_MUL, a, b);
                const ba = makeList(MATH_MUL, negOne, b, a);
                const abba = makeList(MATH_ADD, ab, ba);
                const retval = makeList(MATH_MUL, half, abba);
                return [true, retval];
                */
                switch (compare_sym_sym(lhs, rhs)) {
                    case SIGN_GT: {
                        const A = makeList(opr, rhs, lhs);
                        const C = $.negate(A);
                        const D = value_of(C, $);
                        return [TFLAG_DIFF, D];
                    }
                    default: {
                        return [TFLAG_HALT, expr];
                    }
                }
            }
            else {
                // vector ^ other
                return [TFLAG_HALT, expr];
            }
        }
        else {
            if ($.treatAsScalar(rhs)) {
                // other ^ scalar
                return [TFLAG_HALT, expr];
            }
            else if ($.treatAsVector(rhs)) {
                // other ^ vector
                return [TFLAG_HALT, expr];
            }
            else {
                // other ^ other
                return [TFLAG_HALT, expr];
            }
        }
    }
}

export const outer_2_sym_sym = new Builder();
