import { CHANGED, ExtensionEnv, NOFLAGS, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { makeList } from "../../makeList";
import { MATH_MUL } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { is_scalar } from "../helpers/is_scalar";
import { is_mul_2_scalar_any } from "./is_mul_2_scalar_any";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

/**
 * Scalar1 * (Scalar2 * X) => (Scalar1 * Scalar2) * X
 */
class Op extends Function2<U, BCons<Sym, U, U>> implements Operator<Cons> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('mul_2_scalar_mul_2_scalar_any', MATH_MUL, is_scalar($), and(is_cons, is_mul_2_scalar_any($)), $);
        this.hash = `(* U (*))`;
    }
    isScalar(expr: U): boolean {
        const m = this.match(expr);
        if (m) {
            const $ = this.$;
            return $.isScalar(m.rhs.rhs);
        }
        throw new Error();
    }
    isVector(expr: U): boolean {
        const m = this.match(expr);
        if (m) {
            const $ = this.$;
            return $.isVector(m.rhs.rhs);
        }
        throw new Error();
    }
    transform2(opr: Sym, lhs: U, rhs: BCons<Sym, U, U>, expr: BCons<Sym, U, BCons<Sym, U, U>>): [TFLAGS, U] {
        const $ = this.$;
        if ($.isAssocL(MATH_MUL)) {
            const s1 = lhs;
            const s2 = rhs.lhs;
            const s1s2 = $.valueOf(makeList(MATH_MUL, s1, s2));
            const X = rhs.rhs;
            const S = $.valueOf(makeList(MATH_MUL, s1s2, X));
            return [CHANGED, S];
        }
        return [NOFLAGS, expr];
    }
}

export const mul_2_scalar_mul_2_scalar_any = new Builder();
