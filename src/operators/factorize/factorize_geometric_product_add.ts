import { ExtensionEnv, FEATURE, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { hash_binop_cons_cons } from "../../hashing/hash_info";
import { MATH_ADD, MATH_INNER, MATH_MUL, MATH_OUTER } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, items_to_cons, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { BCons } from "../helpers/BCons";
import { Function2X } from "../helpers/Function2X";
import { is_inner_2_sym_sym } from "../inner/is_inner_2_sym_sym";
import { is_outer_2_sym_sym } from "../outer/is_outer_2_sym_sym";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

type LHS = BCons<Sym, Sym, Sym>;
type RHS = BCons<Sym, Sym, Sym>;
type EXPR = BCons<Sym, LHS, RHS>;

/**
 * Match a|b + a^b, ensuring a,b are vectors and that the appropriate parts are equal.
 * TODO: Generalize to 
 */
function cross($: ExtensionEnv) {
    return function (lhs: LHS, rhs: RHS): boolean {
        if ($.isFactoring()) {
            const a = lhs.lhs;
            const b = lhs.rhs;
            if (a.equalsSym(rhs.lhs) && b.equals(rhs.rhs)) {
                return $.treatAsVector(a) && $.treatAsVector(b);
            }
            return false;
        }
        else {
            return false;
        }
    };
}

/**
 * TODO: Generalize to vector-valued expressions, $.isVector.
 * 
 * (a|b)+(a^b) => a*b, where a and b are vectors.
 */
class Op extends Function2X<LHS, RHS> implements Operator<EXPR> {
    readonly hash: string;
    readonly dependencies: FEATURE[] = ['Vector'];
    constructor($: ExtensionEnv) {
        super('factorize_geometric_product_add', MATH_ADD, and(is_cons, is_inner_2_sym_sym), and(is_cons, is_outer_2_sym_sym), cross($), $);
        this.hash = hash_binop_cons_cons(MATH_ADD, MATH_INNER, MATH_OUTER);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform2(opr: Sym, lhs: LHS, rhs: RHS): [TFLAGS, U] {
        const a = lhs.lhs;
        const b = lhs.rhs;
        return [TFLAG_DIFF, items_to_cons(MATH_MUL.clone(opr.pos, opr.end), a, b)];
    }
}

export const factorize_geometric_product_add = new Builder();
