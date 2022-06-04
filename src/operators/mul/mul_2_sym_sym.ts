
import { compare_sym_sym } from "../../calculators/compare/compare_sym_sym";
import { TFLAG_DIFF, ExtensionEnv, FEATURE, Operator, OperatorBuilder, SIGN_GT, TFLAG_HALT, TFLAGS } from "../../env/ExtensionEnv";
import { hash_binop_atom_atom, HASH_SYM } from "../../hashing/hash_info";
import { defs } from "../../runtime/defs";
import { MATH_MUL, MATH_POW } from "../../runtime/ns_math";
import { two } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, items_to_cons, U } from "../../tree/tree";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { value_of } from "../helpers/valueOf";
import { is_sym } from "../sym/is_sym";

function canoncal_reorder_factors_sym_sym(opr: Sym, lhs: Sym, rhs: Sym, orig: Cons, $: ExtensionEnv): [TFLAGS, U] {
    // We have to handle the case of equality if we want to use the STABLE flag.
    if (defs.convert_X_times_X_to_power_X_2 && lhs.equalsSym(rhs)) {
        return [TFLAG_DIFF, $.valueOf(items_to_cons(MATH_POW, lhs, two))];
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

class Op extends Function2<LHS, RHS> implements Operator<EXP> {
    readonly breaker = true;
    readonly hash: string;
    readonly dependencies: FEATURE[] = ['~Vector'];
    constructor($: ExtensionEnv) {
        super('mul_2_sym_sym', MATH_MUL, is_sym, is_sym, $);
        this.hash = hash_binop_atom_atom(MATH_MUL, HASH_SYM, HASH_SYM);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isMinusOne(expr: EXP): boolean {
        return false;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isReal(expr: EXP): boolean {
        return true;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isScalar(expr: EXP): boolean {
        return true;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isVector(expr: EXP): boolean {
        return false;
    }
    isZero(expr: EXP): boolean {
        const $ = this.$;
        return $.isZero(expr.lhs) || $.isZero(expr.rhs);
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS, expr: EXP): [TFLAGS, U] {
        const $ = this.$;
        // console.log(`${this.name} lhs: ${type(lhs, $)} = ${lhs} rhs: ${type(rhs, $)} = ${rhs}`);
        // Short Circuit, but only when factoring.
        if (defs.convert_X_times_X_to_power_X_2 && lhs.equals(rhs)) {
            if ($.isFactoring()) {
                return [TFLAG_DIFF, value_of(items_to_cons(MATH_POW, lhs, two), $)];
            }
        }
        return canoncal_reorder_factors_sym_sym(opr, lhs, rhs, expr, $);
    }
}

export const mul_2_sym_sym = new Builder();
