
import { CHANGED, ExtensionEnv, NOFLAGS, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_binop_atom_atom } from "../../hashing/hash_info";
import { makeList } from "../../makeList";
import { MATH_MUL, MATH_POW } from "../../runtime/ns_math";
import { two } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { is_any } from "../helpers/is_any";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

type LHS = U;
type RHS = U;
type EXPR = BCons<Sym, LHS, RHS>;

/**
 * X * X => X ** 2
 */
class Op extends Function2<LHS, RHS> implements Operator<EXPR> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('mul_2_any_any', MATH_MUL, is_any, is_any, $);
        this.hash = hash_binop_atom_atom(MATH_MUL, HASH_ANY, HASH_ANY);
    }
    isImag(expr: EXPR): boolean {
        const $ = this.$;
        return $.isImag(expr.lhs) && $.isReal(expr.rhs);
    }
    isScalar(expr: EXPR): boolean {
        const $ = this.$;
        return $.isScalar(expr.lhs) && $.isScalar(expr.rhs);
    }
    isVector(expr: EXPR): boolean {
        const $ = this.$;
        return ($.isScalar(expr.lhs) && $.isVector(expr.rhs)) || ($.isVector(expr.lhs) && $.isScalar(expr.rhs));
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS, orig: EXPR): [TFLAGS, U] {
        const $ = this.$;
        if (lhs.equals(rhs)) {
            return [CHANGED, $.valueOf(makeList(MATH_POW, lhs, two))];
        }
        return [NOFLAGS, orig];
    }
}

export const mul_2_any_any = new Builder();
