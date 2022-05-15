import { CHANGED, ExtensionEnv, NOFLAGS, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { hash_binop_atom_cons, HASH_RAT } from "../../hashing/hash_info";
import { makeList } from "../../makeList";
import { MATH_MUL } from "../../runtime/ns_math";
import { Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { is_rat } from "../rat/RatExtension";
import { is_mul_2_sym_sym } from "./is_mul_2_sym_sym";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

/**
 * Rat * (Sym1 * Sym2) => (* Rat Sym1 Sym2), in implicate mode only.
 * 
 * TODO: Surely this is done elsewhere more generically?
 */
class Op extends Function2<Rat, BCons<Sym, Sym, Sym>> implements Operator<Cons> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('mul_2_rat_mul_2_sym_sym', MATH_MUL, is_rat, and(is_cons, is_mul_2_sym_sym), $);
        this.hash = hash_binop_atom_cons(MATH_MUL, HASH_RAT, MATH_MUL);
    }
    transform2(opr: Sym, lhs: Rat, rhs: BCons<Sym, Sym, Sym>, expr: BCons<Sym, Rat, BCons<Sym, Sym, Sym>>): [TFLAGS, U] {
        const $ = this.$;
        if ($.explicateMode) {
            return [NOFLAGS, expr];
        }
        if ($.implicateMode) {
            const a = lhs;
            const b = rhs.lhs;
            const c = rhs.rhs;
            const S = makeList(MATH_MUL, a, b, c);
            const vS = $.valueOf(S);
            return [CHANGED, vS];

        }
        return [NOFLAGS, expr];
    }
}

export const mul_2_rat_mul_2_sym_sym = new Builder();
