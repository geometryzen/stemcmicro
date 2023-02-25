
import { compare_sym_sym } from "../../calculators/compare/compare_sym_sym";
import { ExtensionEnv, FEATURE, Operator, OperatorBuilder, SIGN_GT, TFLAGS, TFLAG_DIFF, TFLAG_HALT, TFLAG_NONE } from "../../env/ExtensionEnv";
import { hash_binop_atom_atom, HASH_SYM } from "../../hashing/hash_info";
import { MATH_MUL, MATH_POW } from "../../runtime/ns_math";
import { two } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, items_to_cons, U } from "../../tree/tree";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { value_of } from "../helpers/valueOf";
import { is_sym } from "../sym/is_sym";

/**
 * 
 * @param opr 
 * @param lhs 
 * @param rhs 
 * @param orig 
 * @param $ 
 * @returns 
 */
function canoncal_reorder_factors_sym_sym(opr: Sym, lhs: Sym, rhs: Sym, orig: Cons, $: ExtensionEnv): [TFLAGS, U] {
    // console.lg(`canonical_reorder_factors_sym_sym(opr=${opr})`);
    // We have to handle the case of equality if we want to use the STABLE flag.
    if (lhs.equalsSym(rhs)) {
        if ($.isFactoring()) {
            return [TFLAG_DIFF, $.valueOf(items_to_cons(MATH_POW, lhs, two))];
        }
        else {
            return [TFLAG_NONE, orig];
        }
    }
    switch (compare_sym_sym(lhs, rhs)) {
        case SIGN_GT: {
            return [TFLAG_DIFF, $.valueOf(items_to_cons(opr, rhs, lhs))];
        }
        default: {
            return [TFLAG_HALT, orig];
        }
    }
}

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

type LHS = Sym;
type RHS = Sym;
type EXP = BCons<Sym, LHS, RHS>;

/**
 * TODO: This is suspect. Ordering may conflict with canonical ordering of factors.
 */
class Op extends Function2<LHS, RHS> implements Operator<EXP> {
    readonly hash: string;
    readonly dependencies: FEATURE[] = ['Vector'];
    constructor($: ExtensionEnv) {
        super('mul_2_sym_sym_general', MATH_MUL, is_sym, is_sym, $);
        this.hash = hash_binop_atom_atom(MATH_MUL, HASH_SYM, HASH_SYM);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isMinusOne(expr: EXP): boolean {
        return false;
    }
    isReal(expr: EXP): boolean {
        const $ = this.$;
        return $.isReal(expr.lhs) && $.isReal(expr.rhs);
    }
    isScalar(expr: EXP): boolean {
        const $ = this.$;
        return $.isScalar(expr.lhs) && $.isScalar(expr.rhs);
    }
    isVector(expr: EXP): boolean {
        const $ = this.$;
        return ($.isScalar(expr.lhs) && $.isVector(expr.rhs)) || ($.isVector(expr.lhs) && $.isScalar(expr.rhs));
    }
    isZero(expr: EXP): boolean {
        const $ = this.$;
        return $.isZero(expr.lhs) || $.isZero(expr.rhs);
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS, expr: EXP): [TFLAGS, U] {
        const $ = this.$;
        // Short Circuit, but only when factoring.
        if (lhs.equals(rhs)) {
            if ($.isFactoring()) {
                return [TFLAG_DIFF, value_of(items_to_cons(MATH_POW, lhs, two), $)];
            }
        }
        // console.lg(`${this.name} lhs: ${render_as_infix(lhs, $)} rhs: ${render_as_infix(rhs, $)}`);

        return canoncal_reorder_factors_sym_sym(opr, lhs, rhs, expr, $);
    }
}

export const mul_2_sym_sym_general = new Builder();
