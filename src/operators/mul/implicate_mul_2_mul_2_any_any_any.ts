import { CHANGED, ExtensionEnv, Operator, OperatorBuilder, PHASE_IMPLICATE_FLAG, TFLAGS } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_binop_cons_atom } from "../../hashing/hash_info";
import { makeList } from "../../makeList";
import { MATH_MUL } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { is_any } from "../helpers/is_any";
import { is_mul_2_any_any } from "./is_mul_2_any_any";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

type LHS = BCons<Sym, U, U>;
type RHS = U;
type EXP = BCons<Sym, LHS, RHS>;

/**
 * (A * B) * C => A * B * C
 */
class Op extends Function2<LHS, RHS> implements Operator<EXP> {
    readonly hash: string;
    readonly phases = PHASE_IMPLICATE_FLAG;
    constructor($: ExtensionEnv) {
        super('implicate_mul_2_mul_2_any_any_any', MATH_MUL, and(is_cons, is_mul_2_any_any), is_any, $);
        this.hash = hash_binop_cons_atom(MATH_MUL, MATH_MUL, HASH_ANY);
    }
    isImag(expr: EXP): boolean {
        const $ = this.$;
        return $.isImag(expr.lhs) && $.isReal(expr.rhs);
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS): [TFLAGS, U] {
        const $ = this.$;
        const a = lhs.lhs;
        const b = lhs.rhs;
        const c = rhs;
        return [CHANGED, $.valueOf(makeList(opr, a, b, c))];
    }
}

export const implicate_mul_2_mul_2_any_any_any = new Builder();
