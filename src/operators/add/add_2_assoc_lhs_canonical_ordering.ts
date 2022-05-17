import { CHANGED, ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_binop_cons_atom } from "../../hashing/hash_info";
import { makeList } from "../../makeList";
import { MATH_ADD } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, U } from "../../tree/tree";
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

type LL = U;
type LR = U;
type LHS = BCons<Sym, LL, LR>;
type RHS = U;
type EXP = BCons<Sym, LHS, RHS>;

function cross($: ExtensionEnv) {
    return function (lhs: LHS, rhs: RHS): boolean {
        /*
        if ($.implicateMode) {
            return false;
        }
        */
        // const startTime = new Date().getTime();
        const retval = $.compareTerms(lhs.rhs, rhs) > 0;
        // const endTime = new Date().getTime();
        // console.log(`$.compareTerms took ${endTime - startTime} ms`);
        return retval;
    };
}

/**
 * (X + z) + a => (X + a) + z
 */
class Op extends Function2X<LHS, RHS> implements Operator<EXP> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('add_2_assoc_lhs_canonical_ordering', MATH_ADD, and(is_cons, is_add_2_any_any), is_any, cross($), $);
        this.hash = hash_binop_cons_atom(MATH_ADD, MATH_ADD, HASH_ANY);
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS): [TFLAGS, U] {
        const $ = this.$;
        const X = lhs.lhs;
        const z = lhs.rhs;
        const a = rhs;
        const Xa = $.valueOf(makeList(lhs.opr, X, a));
        const retval = $.valueOf(makeList(opr, Xa, z));
        return [CHANGED, retval];
    }
}

export const add_2_assoc_lhs_canonical_ordering = new Builder();
