import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { hash_binop_atom_atom, HASH_SYM } from "../../hashing/hash_info";
import { MATH_INNER, MATH_MUL } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { Cons, items_to_cons, U } from "../../tree/tree";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { is_sym } from "../sym/is_sym";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

type LHS = Sym;
type RHS = Sym;
type EXP = BCons<Sym, LHS, RHS>;

/**
 * Sym | Sym
 */
class Op extends Function2<LHS, RHS> implements Operator<EXP> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('inner_2_sym_sym', MATH_INNER, is_sym, is_sym, $);
        this.hash = hash_binop_atom_atom(MATH_INNER, HASH_SYM, HASH_SYM);
    }
    isScalar(): boolean {
        return true;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isZero(expr: EXP): boolean {
        // It actually could be zero.
        return false;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform2(opr: Sym, lhs: LHS, rhs: RHS, expr: EXP): [TFLAGS, U] {
        const $ = this.$;
        return [TFLAG_DIFF, $.valueOf(items_to_cons(MATH_MUL.clone(opr.pos, opr.end), lhs, rhs))];
    }
}

export const inner_2_sym_sym = new Builder();
