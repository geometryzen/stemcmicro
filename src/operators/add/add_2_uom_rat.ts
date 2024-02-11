import { is_rat, is_uom, Uom } from "math-expression-atoms";
import { Cons2 } from "math-expression-tree";
import { ExtensionEnv, FEATURE, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { hash_binop_atom_atom, HASH_RAT, HASH_UOM } from "../../hashing/hash_info";
import { MATH_ADD } from "../../runtime/ns_math";
import { Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { Function2 } from "../helpers/Function2";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

type LHS = Uom;
type RHS = Rat;
type EXP = Cons2<Sym, LHS, RHS>;

class Op extends Function2<LHS, RHS> implements Operator<EXP> {
    readonly #hash: string;
    readonly dependencies: FEATURE[] = ['Uom'];
    constructor($: ExtensionEnv) {
        super('add_2_uom_rat', MATH_ADD, is_uom, is_rat, $);
        this.#hash = hash_binop_atom_atom(MATH_ADD, HASH_UOM, HASH_RAT);
    }
    get hash(): string {
        return this.#hash;
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS, expr: EXP): [TFLAGS, U] {
        throw new TypeError(this.$.toInfixString(expr));
    }
}

export const add_2_uom_rat = new Builder();
