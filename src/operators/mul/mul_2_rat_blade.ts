
import { Blade, is_blade, is_rat, Rat, Sym, zero } from "math-expression-atoms";
import { Cons, U } from "math-expression-tree";
import { ExtensionEnv, FEATURE, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF, TFLAG_HALT } from "../../env/ExtensionEnv";
import { hash_binop_atom_atom, HASH_BLADE, HASH_RAT } from "../../hashing/hash_info";
import { MATH_MUL } from "../../runtime/ns_math";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

type LHS = Rat;
type RHS = Blade;
type EXP = BCons<Sym, LHS, RHS>

function Eval_mul_2_rat_blade(expr: EXP): U {
    const lhs = expr.lhs;
    const rhs = expr.rhs;
    try {
        return mul_2_rat_blade(lhs, rhs, expr);
    }
    finally {
        lhs.release();
        rhs.release();
    }
}

function mul_2_rat_blade(lhs: Rat, rhs: Blade, expr: EXP): Rat | Blade | EXP {
    if (lhs.isZero()) {
        return zero;
    }
    if (lhs.isOne()) {
        return rhs;
    }
    return expr;

}

/**
 * (* Rat Blade) => (* Rat Blade) STABLE
 *               => 0 if Rat is zero
 *               => Blade if Rat is one
 */
class Op extends Function2<LHS, RHS> implements Operator<EXP> {
    readonly #hash: string;
    readonly dependencies: FEATURE[] = ['Blade'];
    constructor($: ExtensionEnv) {
        super('mul_2_rat_blade', MATH_MUL, is_rat, is_blade, $);
        this.#hash = hash_binop_atom_atom(MATH_MUL, HASH_RAT, HASH_BLADE);
    }
    get hash(): string {
        return this.#hash;
    }
    valueOf(expr: EXP): U {
        return Eval_mul_2_rat_blade(expr);
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS, expr: EXP): [TFLAGS, U] {
        const retval = mul_2_rat_blade(lhs, rhs, expr);
        if (retval.equals(expr)) {
            return [TFLAG_HALT, retval];
        }
        else {
            return [TFLAG_DIFF, retval];
        }
    }
}

export const mul_2_rat_blade_builder = new Builder();
