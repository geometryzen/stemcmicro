import { do_factorize_rhs } from "../../calculators/factorize/do_factorize_rhs";
import { is_factorize_rhs } from "../../calculators/factorize/is_factorize_rhs";
import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_binop_cons_atom } from "../../hashing/hash_info";
import { MATH_ADD } from "../../runtime/ns_math";
import { one } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, items_to_cons, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { BCons } from "../helpers/BCons";
import { Function2X } from "../helpers/Function2X";
import { is_any } from "../helpers/is_any";
import { is_add_2_any_any } from "./is_add_2_any_any";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

type LHS = BCons<Sym, U, U>;
type RHS = U;
type EXP = BCons<Sym, LHS, RHS>;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function cross($: ExtensionEnv) {
    return function (lhs: LHS, rhs: RHS): boolean {
        // A problem with this is that we have performed the tree transformation either twice
        // if is successful, or partially if it fails.
        return is_factorize_rhs(lhs.rhs, rhs);
    };
}

/**
 * (X + Y) + Z => (X + m * A) + n * A => X + (m + n) * A, where Y = m * A, and Z = n * A.
 */
class Op extends Function2X<LHS, RHS> implements Operator<EXP> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('add_2_add_2_any_any_any_factorize_rhs', MATH_ADD, and(is_cons, is_add_2_any_any), is_any, cross($), $);
        this.hash = hash_binop_cons_atom(MATH_ADD, MATH_ADD, HASH_ANY);
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS, orig: EXP): [TFLAGS, U] {
        const $ = this.$;
        if ($.isExpanding()) {
            const X = lhs.lhs;
            const Y = lhs.rhs;
            const Z = rhs;
            const mnA = do_factorize_rhs(Y, Z, one, orig, $)[1];
            return [TFLAG_DIFF, $.valueOf(items_to_cons(MATH_ADD, X, mnA))];
        }
        else {
            return [TFLAG_NONE, orig];
        }
    }
}

export const add_2_add_2_any_any_any_factorize_rhs = new Builder();
