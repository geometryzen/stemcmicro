import { CostTable } from "../../env/CostTable";
import { CHANGED, ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { hash_binop_atom_cons, HASH_SYM } from "../../hashing/hash_info";
import { makeList } from "../../makeList";
import { MATH_INNER, MATH_MUL } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { BCons } from "../helpers/BCons";
import { Function2X } from "../helpers/Function2X";
import { is_inner_2_sym_sym } from "../inner/is_inner_2_sym_sym";
import { is_sym } from "../sym/is_sym";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

function cross($: ExtensionEnv) {
    return function (lhs: Sym, rhs: BCons<Sym, Sym, Sym>): boolean {
        return $.treatAsVector(lhs) && $.treatAsVector(rhs.lhs) && $.treatAsVector(rhs.rhs);
    };
}

/**
 * a*(b|c) => (b|c)*a, where a,b,c are vectors.
 */
class Op extends Function2X<Sym, BCons<Sym, Sym, Sym>> implements Operator<BCons<Sym, Sym, BCons<Sym, Sym, Sym>>> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('mul_2_sym_inner_2_sym_sym', MATH_MUL, is_sym, and(is_cons, is_inner_2_sym_sym), cross($), $);
        this.hash = hash_binop_atom_cons(MATH_MUL, HASH_SYM, MATH_INNER);
    }
    cost(expr: BCons<Sym, Sym, BCons<Sym, Sym, Sym>>, costs: CostTable, depth: number): number {
        return super.cost(expr, costs, depth) + 1;
    }
    transform2(opr: Sym, lhs: Sym, rhs: BCons<Sym, Sym, Sym>): [TFLAGS, U] {
        return [CHANGED, makeList(opr, rhs, lhs)];
    }
}

export const mul_2_sym_inner_2_sym_sym = new Builder();
