import { ExtensionEnv, Operator, OperatorBuilder, MODE_EXPANDING, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_binop_cons_atom } from "../../hashing/hash_info";
import { makeList } from "../../makeList";
import { MATH_ADD, MATH_MUL } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, U } from "../../tree/tree";
import { is_add_2_any_any } from "../add/is_add_2_any_any";
import { and } from "../helpers/and";
import { BCons } from "../helpers/BCons";
import { Function2X } from "../helpers/Function2X";
import { is_any } from "../helpers/is_any";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

type LHS = BCons<Sym, U, U>;
type RHS = U;
type EXP = BCons<Sym, LHS, RHS>;

function cross($: ExtensionEnv) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return function (lhs: LHS, rhs: RHS): boolean {
        return $.isExpanding();
    };
}

/**
 * Operation * is right-distributive over (or with respect to ) +
 * 
 * (A + B) * C => (A * C) + (B * C) 
 */
class Op extends Function2X<LHS, RHS> implements Operator<EXP> {
    readonly hash: string;
    readonly phases = MODE_EXPANDING;
    constructor($: ExtensionEnv) {
        super('mul_rhs_distrib_over_add_expand', MATH_MUL, and(is_cons, is_add_2_any_any), is_any, cross($), $);
        this.hash = hash_binop_cons_atom(this.opr, MATH_ADD, HASH_ANY);
    }
    isZero(expr: EXP): boolean {
        const $ = this.$;
        return $.isZero(expr.lhs) || $.isZero(expr.rhs);
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS): [TFLAGS, U] {
        const a = lhs.lhs;
        const b = lhs.rhs;
        const c = rhs;
        const ac = makeList(opr, a, c);
        const bc = makeList(opr, b, c);
        return [TFLAG_DIFF, makeList(lhs.opr, ac, bc)];
    }
}

/**
 * Operation * is right-distributive over (or with respect to ) +
 * 
 * (A + B) * C => (A * C) + (A * B) 
 */
export const mul_rhs_distrib_over_add_expand = new Builder();
