/* eslint-disable @typescript-eslint/no-unused-vars */
import { CHANGED, ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { MATH_ADD, MATH_MUL } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, makeList, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { BCons } from "../helpers/BCons";
import { Function2X } from "../helpers/Function2X";
import { is_mul_2_inner_2_sym_sym_sym } from "../mul/is_mul_2_inner_2_sym_sym_sym";
import { is_mul_2_sym_outer_2_sym_sym } from "../mul/is_mul_2_sym_outer_2_sym_sym";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

type LHSLHS = BCons<Sym, Sym, Sym>;
type LHSRHS = Sym;
type LHS = BCons<Sym, LHSLHS, LHSRHS>;
type RHSLHS = Sym;
type RHSRHS = BCons<Sym, Sym, Sym>;
type RHS = BCons<Sym, RHSLHS, RHSRHS>;
type EXPR = BCons<Sym, LHS, RHS>;

function cross($: ExtensionEnv) {
    return function (lhs: LHS, rhs: RHS): boolean {
        if ($.isFactoring()) {
            const b1 = lhs.lhs.lhs;
            const c1 = lhs.lhs.rhs;
            const a1 = lhs.rhs;
            const a2 = rhs.lhs;
            const b2 = rhs.rhs.lhs;
            const c2 = rhs.rhs.rhs;
            if (a1.equalsSym(a2) && b1.equalsSym(b2) && c1.equalsSym(c2)) {
                return $.treatAsVector(a1) && $.treatAsVector(b1) && $.treatAsVector(c1);
            }
            return false;
        }
        else {
            return false;
        }
    };
}

/**
 * (b|c)*a+a*(b^c) => a*(b|c)+a*(b^c) => a*(b*c) 
 * (+ (* (| b c) a) (* a (^ b c))) => (a * b) * c, where a,b,c vectors. (factorization).
 */
class Op extends Function2X<LHS, RHS> implements Operator<EXPR> {
    constructor($: ExtensionEnv) {
        super('add_2_mul_2_inner_2_sym_sym_sym_mul_2_sym_outer_2_sym_sym', MATH_ADD, and(is_cons, is_mul_2_inner_2_sym_sym_sym), and(is_cons, is_mul_2_sym_outer_2_sym_sym), cross($), $);
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS, expr: EXPR): [TFLAGS, U] {
        const a = lhs.rhs;
        const b = lhs.lhs.lhs;
        const c = lhs.lhs.rhs;
        const bc = makeList(MATH_MUL, b, c);
        return [CHANGED, makeList(MATH_MUL, a, bc)];
    }
}

export const add_2_mul_2_inner_2_sym_sym_sym_mul_2_sym_outer_2_sym_sym = new Builder();
