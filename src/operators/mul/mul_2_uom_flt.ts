
import { CostTable } from "../../env/CostTable";
import { TFLAG_DIFF, ExtensionEnv, FEATURE, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { hash_binop_atom_atom, HASH_FLT, HASH_UOM } from "../../hashing/hash_info";
import { makeList } from "../../makeList";
import { MATH_MUL } from "../../runtime/ns_math";
import { Flt } from "../../tree/flt/Flt";
import { is_flt } from "../../tree/flt/is_flt";
import { zero } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { is_uom } from "../../tree/uom/is_uom";
import { Uom } from "../../tree/uom/Uom";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

type LHS = Uom;
type RHS = Flt;
type EXP = BCons<Sym, LHS, RHS>

/**
 * (* Uom Flt) => (* Flt Uom)
 *             => 0 if Flt is zero
 *             => Uom if Flt is one
 */
class Op extends Function2<LHS, RHS> implements Operator<EXP> {
    readonly hash: string;
    readonly dependencies: FEATURE[] = ['Flt', 'Uom'];
    constructor($: ExtensionEnv) {
        super('mul_2_uom_flt', MATH_MUL, is_uom, is_flt, $);
        this.hash = hash_binop_atom_atom(MATH_MUL, HASH_UOM, HASH_FLT);
    }
    cost(expr: EXP, costs: CostTable, depth: number): number {
        const baseCost = super.cost(expr, costs, depth);
        return baseCost + 1;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isScalar(expr: EXP): boolean {
        return true;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isVector(expr: EXP): boolean {
        return false;
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS): [TFLAGS, U] {
        if (rhs.isZero()) {
            return [TFLAG_DIFF, zero];
        }
        if (rhs.isOne()) {
            return [TFLAG_DIFF, lhs];
        }
        return [TFLAG_DIFF, makeList(opr, rhs, lhs)];
    }
}

export const mul_2_uom_flt = new Builder();
