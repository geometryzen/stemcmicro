import { Flt, is_flt, is_uom, Sym, Uom } from "math-expression-atoms";
import { Cons, Cons2, U } from "math-expression-tree";
import { ExtensionEnv, FEATURE, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { hash_binop_atom_atom, HASH_FLT, HASH_UOM } from "../../hashing/hash_info";
import { MATH_ADD } from "../../runtime/ns_math";
import { Function2 } from "../helpers/Function2";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

type LHS = Flt;
type RHS = Uom;
type EXP = Cons2<Sym, LHS, RHS>;

class Op extends Function2<LHS, RHS> implements Operator<EXP> {
    readonly #hash: string;
    readonly dependencies: FEATURE[] = ['Flt', 'Uom'];
    constructor($: ExtensionEnv) {
        super('add_2_flt_uom', MATH_ADD, is_flt, is_uom, $);
        this.#hash = hash_binop_atom_atom(MATH_ADD, HASH_FLT, HASH_UOM);
    }
    get hash(): string {
        return this.#hash;
    }
    transform2(opr: Sym, lhs: Flt, rhs: RHS, expr: EXP): [TFLAGS, U] {
        throw new TypeError(this.$.toInfixString(expr));
    }
}

export const add_2_flt_uom = new Builder();
