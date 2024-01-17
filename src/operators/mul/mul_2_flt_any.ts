
import { ExtensionEnv, FEATURE, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_binop_atom_atom, HASH_FLT } from "../../hashing/hash_info";
import { MATH_MUL } from "../../runtime/ns_math";
import { Flt } from "../../tree/flt/Flt";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { is_flt } from "../flt/is_flt";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { is_any } from "../helpers/is_any";

class Builder implements OperatorBuilder<Cons> {
    constructor(readonly opr: Sym) {

    }
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($, this.opr);
    }
}

type LHS = Flt;
type RHS = U;
type EXP = BCons<Sym, LHS, RHS>

class Op extends Function2<LHS, RHS> implements Operator<EXP> {
    readonly #hash: string;
    readonly dependencies: FEATURE[] = [];
    constructor($: ExtensionEnv, opr: Sym) {
        super('mul_2_flt_any', opr, is_flt, is_any, $);
        this.#hash = hash_binop_atom_atom(opr, HASH_FLT, HASH_ANY);
    }
    get hash(): string {
        return this.#hash;
    }
    isKind(expr: U): expr is EXP {
        if (super.isKind(expr)) {
            const lhs = expr.lhs;
            return lhs.isZero();
        }
        else {
            return false;
        }
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS, orig: EXP): [TFLAGS, U] {
        // console.lg(this.name, render_as_infix(lhs, this.$), render_as_infix(rhs, this.$), render_as_infix(orig, this.$));
        if (lhs.isZero()) {
            return [TFLAG_DIFF, lhs];
        }
        else {
            return [TFLAG_NONE, orig];
        }
    }
}

export const mul_2_flt_any = new Builder(MATH_MUL);
