import { ExtensionEnv, Operator, OperatorBuilder, PHASE_EXPANDING, PHASE_IMPLICATE, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { hash_binop_cons_atom, HASH_SYM } from "../../hashing/hash_info";
import { MATH_MUL } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, items_to_cons, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { is_sym } from "../sym/is_sym";
import { is_mul_2_sym_sym } from "./is_mul_2_sym_sym";

type LHS = BCons<Sym, Sym, Sym>;
type RHS = Sym;
type EXP = BCons<Sym, LHS, RHS>;

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

/**
 * (a * b) * c => (* a b c)
 */
class Op extends Function2<LHS, RHS> implements Operator<EXP> {
    readonly hash: string;
    readonly phases = PHASE_IMPLICATE | PHASE_EXPANDING;
    constructor($: ExtensionEnv) {
        super('implicate_mul_2_mul_2_sym_sym_sym', MATH_MUL, and(is_cons, is_mul_2_sym_sym), is_sym, $);
        this.hash = hash_binop_cons_atom(MATH_MUL, MATH_MUL, HASH_SYM);
    }
    isImag(expr: EXP): boolean {
        // RHS is a symbol and so can only be a real or a vector over the reals.
        return this.$.isImag(expr.lhs);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform2(opr: Sym, lhs: LHS, rhs: RHS, expr: EXP): [TFLAGS, U] {
        const $ = this.$;
        if (shouldImplicate($)) {
            const a = lhs.lhs;
            const b = lhs.rhs;
            const c = rhs;
            const abc = $.valueOf(items_to_cons(MATH_MUL, a, b, c));
            return [TFLAG_DIFF, abc];
        }
        else {
            return [TFLAG_NONE, expr];
        }
    }
}

function shouldImplicate($: ExtensionEnv): boolean {
    if ($.isImplicating()) {
        return true;
    }
    else if ($.isExpanding()) {
        if ($.isAssociationImplicit()) {
            return true;
        }
        else {
            return false;
        }
    }
    else {
        throw new Error();
    }
}

export const implicate_mul_2_mul_2_sym_sym_sym = new Builder();
