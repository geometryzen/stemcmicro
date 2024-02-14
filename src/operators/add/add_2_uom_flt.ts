import { is_uom, Uom } from "math-expression-atoms";
import { Extension, ExtensionEnv, FEATURE, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { hash_binop_atom_atom, HASH_FLT, HASH_UOM } from "../../hashing/hash_info";
import { MATH_ADD } from "../../runtime/ns_math";
import { Flt } from "../../tree/flt/Flt";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { is_flt } from "../flt/is_flt";
import { Cons2 } from "../helpers/Cons2";
import { Function2 } from "../helpers/Function2";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

type LHS = Uom;
type RHS = Flt;
type EXP = Cons2<Sym, LHS, RHS>;

class Op extends Function2<LHS, RHS> implements Extension<EXP> {
    readonly #hash: string;
    readonly dependencies: FEATURE[] = ['Flt', 'Uom'];
    constructor() {
        super('add_2_uom_flt', MATH_ADD, is_uom, is_flt, $);
        this.#hash = hash_binop_atom_atom(MATH_ADD, HASH_UOM, HASH_FLT);
    }
    get hash(): string {
        return this.#hash;
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS, expr: EXP): [TFLAGS, U] {
        throw new TypeError(this.$.toInfixString(expr));
    }
}

export const add_2_uom_flt = new Builder();
