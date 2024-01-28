
import { ExtensionEnv, FEATURE, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_binop_atom_atom, HASH_RAT } from "../../hashing/hash_info";
import { MATH_MUL } from "../../runtime/ns_math";
import { Rat, zero } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { Cons2 } from "../helpers/Cons2";
import { Function2 } from "../helpers/Function2";
import { is_any } from "../helpers/is_any";
import { is_rat } from "../rat/is_rat";

class Builder implements OperatorBuilder<Cons> {
    constructor(readonly opr: Sym) {

    }
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($, this.opr);
    }
}

type LHS = U;
type RHS = Rat;
type EXP = Cons2<Sym, LHS, RHS>

class Op extends Function2<LHS, RHS> implements Operator<EXP> {
    readonly #hash: string;
    readonly dependencies: FEATURE[] = [];
    constructor($: ExtensionEnv, opr: Sym) {
        super('mul_2_any_rat', opr, is_any, is_rat, $);
        this.#hash = hash_binop_atom_atom(opr, HASH_ANY, HASH_RAT);
    }
    get hash(): string {
        return this.#hash;
    }
    isKind(expr: U): expr is EXP {
        if (super.isKind(expr)) {
            const rhs = expr.rhs;
            return rhs.isZero() || rhs.isOne();
        }
        else {
            return false;
        }
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS, orig: EXP): [TFLAGS, U] {
        // console.lg(this.name, render_as_infix(lhs, this.$), render_as_infix(rhs, this.$), render_as_infix(orig, this.$));
        if (rhs.isOne()) {
            return [TFLAG_DIFF, lhs];
        }
        else if (rhs.isZero()) {
            return [TFLAG_DIFF, zero];
        }
        else {
            return [TFLAG_NONE, orig];
        }
    }
}

export const mul_2_any_rat = new Builder(MATH_MUL);
