import { compare_sym_sym } from "../../calculators/compare/compare_sym_sym";
import { CostTable } from "../../env/CostTable";
import { CHANGED, ExtensionEnv, NOFLAGS, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { makeList } from "../../makeList";
import { MATH_MUL } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { BCons } from "../helpers/BCons";
import { Function2X } from "../helpers/Function2X";
import { is_sym } from "../sym/is_sym";
import { is_mul_2_any_sym } from "./is_mul_2_any_sym";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

function symbols_will_exchange(z: Sym, a: Sym, $: ExtensionEnv): boolean {
    if ($.isScalar(z) || $.isScalar(a)) {
        return compare_sym_sym(z, a) > 0;
    }
    return false;
}

function symbols_must_exchange($: ExtensionEnv) {
    return function cross(lhs: BCons<Sym, U, Sym>, rhs: Sym): boolean {
        return symbols_will_exchange(lhs.rhs, rhs, $);
    };
}


/**
 * (X * z) * a => (X * a) * z
 * More fundamentally,
 * (X * z) * a => X * (z * a) => X * (a * z) => (X * a) * z
 */
class Op extends Function2X<BCons<Sym, U, Sym>, Sym> implements Operator<BCons<Sym, BCons<Sym, U, Sym>, Sym>> {
    constructor($: ExtensionEnv) {
        super('mul_2_mul_2_any_sym_sym', MATH_MUL, and(is_cons, is_mul_2_any_sym), is_sym, symbols_must_exchange($), $);
    }
    cost(expr: BCons<Sym, BCons<Sym, U, Sym>, Sym>, costs: CostTable, depth: number): number {
        return super.cost(expr, costs, depth) + 1;
    }
    transform2(opr: Sym, lhs: BCons<Sym, U, Sym>, rhs: Sym, orig: BCons<Sym, BCons<Sym, U, Sym>, Sym>): [TFLAGS, U] {
        const $ = this.$;
        if ($.isAssocL(MATH_MUL)) {
            const X = lhs.lhs;
            const z = lhs.rhs;
            const a = rhs;
            const Xa = makeList(opr, X, a);
            const Xaz = makeList(lhs.opr, Xa, z);
            return [CHANGED, Xaz];
        }
        return [NOFLAGS, orig];
    }
}

export const mul_2_mul_2_any_sym_sym = new Builder();
