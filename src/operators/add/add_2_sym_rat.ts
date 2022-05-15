
import { CostTable } from "../../env/CostTable";
import { CHANGED, ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { hash_binop_atom_atom, HASH_RAT, HASH_SYM } from "../../hashing/hash_info";
import { MATH_ADD } from "../../runtime/ns_math";
import { is_rat } from "../../tree/rat/is_rat";
import { Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, makeList, U } from "../../tree/tree";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { is_sym } from "../sym/is_sym";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

/**
 * Sym + Rat => Rat + Sym
 */
class Op extends Function2<Sym, Rat> implements Operator<BCons<Sym, Sym, Rat>> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('add_2_sym_rat', MATH_ADD, is_sym, is_rat, $);
        this.hash = hash_binop_atom_atom(MATH_ADD, HASH_SYM, HASH_RAT);
    }
    cost(expr: BCons<Sym, Sym, Rat>, costs: CostTable, depth: number): number {
        const baseCost = super.cost(expr, costs, depth);
        return baseCost + 1;
    }
    transform2(opr: Sym, lhs: Sym, rhs: Rat): [TFLAGS, U] {
        if (rhs.isZero()) {
            return [CHANGED, lhs];
        }
        else {
            const $ = this.$;
            return [CHANGED, $.valueOf(makeList(opr, rhs, lhs))];
        }
    }
}

export const add_2_sym_rat = new Builder();
