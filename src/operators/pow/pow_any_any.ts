import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_binop_atom_atom } from "../../hashing/hash_info";
import { MATH_POW } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { is_any } from "../helpers/is_any";
import { power_v1 } from "./power_v1";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

type LHS = U;
type RHS = U;
type EXP = BCons<Sym, LHS, RHS>;

/**
 * 
 */
class Op extends Function2<LHS, RHS> implements Operator<EXP> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('pow_2_any_any', MATH_POW, is_any, is_any, $);
        this.hash = hash_binop_atom_atom(MATH_POW, HASH_ANY, HASH_ANY);
    }
    isZero(expr: EXP): boolean {
        return this.$.iszero(expr.lhs);
    }
    transform2(opr: Sym, base: LHS, expo: RHS, expr: EXP): [TFLAGS, U] {
        const $ = this.$;
        if ($.isExpanding()) {
            const newExpr = power_v1(base, expo, this.$);
            return [!newExpr.equals(expr) ? TFLAG_DIFF : TFLAG_NONE, newExpr];
        }
        else if ($.isFactoring()) {
            return [TFLAG_NONE, expr];
        }
        else {
            throw new Error();
        }
    }
}

export const pow_2_any_any = new Builder();
