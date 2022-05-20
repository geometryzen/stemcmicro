import { compare_terms_redux } from "../../calculators/compare/compare_terms";
import { CHANGED, ExtensionEnv, NOFLAGS, Operator, OperatorBuilder, PHASE_FLAGS_EXPANDING_UNION_FACTORING, SIGN_GT, TFLAGS } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_binop_cons_atom } from "../../hashing/hash_info";
import { makeList } from "../../makeList";
import { MATH_ADD } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { is_any } from "../helpers/is_any";
import { is_add_2_any_any } from "./is_add_2_any_any";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

type LHS = BCons<Sym, U, U>;
type RHS = U;
type EXPR = BCons<Sym, LHS, RHS>;

/**
 * TODO: Split the functions of changing association and implicating.
 * (X + Y) + Z
 */
class Op extends Function2<LHS, RHS> implements Operator<EXPR> {
    readonly hash: string;
    readonly phases = PHASE_FLAGS_EXPANDING_UNION_FACTORING;
    constructor($: ExtensionEnv) {
        super('add_2_add_2_any_any_any', MATH_ADD, and(is_cons, is_add_2_any_any), is_any, $);
        this.hash = hash_binop_cons_atom(MATH_ADD, MATH_ADD, HASH_ANY);
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS, orig: EXPR): [TFLAGS, U] {
        const $ = this.$;
        if ($.isAssocR(MATH_ADD)) {
            // (a + b) + c => a + (b + c)
            const a = lhs.lhs;
            const b = lhs.rhs;
            const c = rhs;
            const bc = $.valueOf(makeList(MATH_ADD, b, c));
            const abc = $.valueOf(makeList(MATH_ADD, a, bc));
            return [CHANGED, abc];
        }
        const X = lhs.lhs;
        const Z = lhs.rhs;
        const A = rhs;
        const signum = compare_terms_redux(Z, A, $);
        // console.log(`${this.name} ${signum} lhs=${print_expr(lhs, $)} rhs=${print_expr(rhs, $)}`);
        switch (signum) {
            case SIGN_GT: {
                // (X + Z) + A => (X + A) + Z
                const XA = $.valueOf(makeList(lhs.opr, X, A));
                const retval = $.valueOf(makeList(opr, XA, Z));
                return [CHANGED, retval];
            }
            default: {
                return [NOFLAGS, orig];
            }
        }
        /*
        if ($.implicateMode) {
            return [CHANGED, $.valueOf(makeList(opr, lhs.lhs, lhs.rhs, rhs))];
        }
        */
    }
}

export const add_2_add_2_any_any_any = new Builder();
