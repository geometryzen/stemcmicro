
import { ExtensionEnv, FEATURE, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
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

type LHS = U;
type RHS = Flt;
type EXP = BCons<Sym, LHS, RHS>

class Op extends Function2<LHS, RHS> implements Operator<EXP> {
    readonly #hash: string;
    readonly dependencies: FEATURE[] = [];
    constructor($: ExtensionEnv, opr: Sym) {
        super('mul_2_any_flt', opr, is_any, is_flt, $);
        this.#hash = hash_binop_atom_atom(opr, HASH_ANY, HASH_FLT);
    }
    get hash(): string {
        return this.#hash;
    }
    isKind(expr: U): expr is EXP {
        if (super.isKind(expr)) {
            const rhs = expr.rhs;
            return rhs.isZero();
        }
        else {
            return false;
        }
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS): [TFLAGS, U] {
        // console.lg(this.name, render_as_infix(lhs, this.$), render_as_infix(rhs, this.$), render_as_infix(orig, this.$));
        if (rhs.isZero()) {
            // TODO: We could be wrong here. e.g. if the lhs is a Tensor, we lose the structure.
            return [TFLAG_DIFF, rhs];
        }
        else {
            throw new Error();
        }
    }
}

export const mul_2_any_flt = new Builder(MATH_MUL);
