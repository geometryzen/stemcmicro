import { TFLAG_DIFF, ExtensionEnv, TFLAG_NONE, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_binop_atom_atom } from "../../hashing/hash_info";
import { MATH_ADD } from "../../runtime/ns_math";
import { subst } from "../../subst";
import { Hyp } from "../../tree/hyp/Hyp";
import { Sym } from "../../tree/sym/Sym";
import { Cons, makeList, U } from "../../tree/tree";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { is_any } from "../helpers/is_any";
import { MATH_STANDARD_PART } from "../st/MATH_STANDARD_PART";
import { MATH_DERIVATIVE } from "./MATH_DERIVATIVE";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

type LHS = U;
type RHS = U;
type EXP = BCons<Sym, LHS, RHS>;

class Op extends Function2<LHS, RHS> implements Operator<EXP> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('derivative_2_any_any', MATH_DERIVATIVE, is_any, is_any, $);
        this.hash = hash_binop_atom_atom(MATH_DERIVATIVE, HASH_ANY, HASH_ANY);
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS, expr: EXP): [TFLAGS, U] {
        const $ = this.$;
        const X = rhs;
        // Nonstandard analysis...
        const p0 = new Hyp(`d${X}`, X.pos, X.end);
        const p1 = subst(lhs, X, makeList(MATH_ADD, X, p0), $);
        const p2 = $.negate(lhs);
        const p3 = makeList(MATH_ADD, p1, p2);
        const p4 = $.divide(p3, p0);
        const retval = $.valueOf(makeList(MATH_STANDARD_PART, p4));

        // Lookup 
        // const retval = derivative_wrt(lhs, rhs, $);
        const changed = !retval.equals(expr);
        return [changed ? TFLAG_DIFF : TFLAG_NONE, retval];
    }
}

export const derivative_2_any_any = new Builder();
