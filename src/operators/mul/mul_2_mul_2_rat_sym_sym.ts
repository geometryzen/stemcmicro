import { CHANGED, ExtensionEnv, NOFLAGS, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { hash_binop_cons_atom, HASH_SYM } from "../../hashing/hash_info";
import { makeList } from "../../makeList";
import { MATH_MUL } from "../../runtime/ns_math";
import { Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { is_sym } from "../sym/is_sym";
import { is_mul_2_rat_sym } from "./is_mul_2_rat_sym";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

type LL = Rat;
type LR = Sym;
type LHS = BCons<Sym, LL, LR>;
type RHS = Sym;
type EXP = BCons<Sym, LHS, RHS>;

/**
 * (Rat * Sym1) * Sym2 => Rat * (Sym1 * Sym2), when right associating only.
 */
class Op extends Function2<LHS, RHS> implements Operator<EXP> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('mul_2_mul_2_rat_sym_sym', MATH_MUL, and(is_cons, is_mul_2_rat_sym), is_sym, $);
        this.hash = hash_binop_cons_atom(MATH_MUL, MATH_MUL, HASH_SYM);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isScalar(expr: EXP): boolean {
        const $ = this.$;
        const s1 = expr.lhs.rhs;
        const s2 = expr.lhs.rhs;
        // TODO: Another possibility is that s1 and s2 are the same vector.
        return $.isScalar(s1) && $.isScalar(s2);
    }
    isZero(expr: EXP): boolean {
        return expr.lhs.lhs.isZero();
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS, expr: EXP): [TFLAGS, U] {
        const $ = this.$;
        if ($.isAssocR(MATH_MUL)) {
            const n = lhs.lhs;
            const a = lhs.rhs;
            const b = rhs;
            const ab = $.valueOf(makeList(opr, a, b));
            const nab = $.valueOf(makeList(lhs.opr, n, ab));
            return [CHANGED, nab];
        }
        return [NOFLAGS, expr];
    }
}

export const mul_2_mul_2_rat_sym_sym = new Builder();
