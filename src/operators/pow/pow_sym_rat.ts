import { TFLAG_DIFF, ExtensionEnv, Operator, OperatorBuilder, TFLAG_HALT, TFLAGS } from "../../env/ExtensionEnv";
import { hash_binop_atom_atom, HASH_RAT, HASH_SYM } from "../../hashing/hash_info";
import { MATH_POW } from "../../runtime/ns_math";
import { is_rat } from "../rat/is_rat";
import { one, Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { is_sym } from "../sym/is_sym";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

type LHS = Sym;
type RHS = Rat;
type EXPR = BCons<Sym, LHS, RHS>;

class Op extends Function2<LHS, RHS> implements Operator<EXPR> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('pow_2_sym_rat', MATH_POW, is_sym, is_rat, $);
        this.hash = hash_binop_atom_atom(MATH_POW, HASH_SYM, HASH_RAT);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isReal(expr: EXPR): boolean {
        return true;
    }
    isScalar(expr: EXPR): boolean {
        const base = expr.lhs;
        // TODO: If the symbol was a vector, and it was squared then it might be a scalar.
        return this.$.isscalar(base);
    }
    transform2(opr: Sym, base: LHS, expo: RHS, expr: EXPR): [TFLAGS, U] {
        // No change in arguments
        if (expo.isOne()) {
            return [TFLAG_DIFF, base];
        }
        else if (expo.isZero()) {
            // TODO: Some debate here about how (pow 0 0) should be handled.
            return [TFLAG_DIFF, one];
        }
        else {
            return [TFLAG_HALT, expr];
        }
    }
}

export const pow_2_sym_rat = new Builder();
