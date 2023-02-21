import { TFLAG_DIFF, ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { hash_binop_atom_atom, HASH_RAT, HASH_UOM } from "../../hashing/hash_info";
import { MATH_ADD } from "../../runtime/ns_math";
import { Err } from "../../tree/err/Err";
import { is_rat } from "../rat/is_rat";
import { Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { Uom } from "../../tree/uom/Uom";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { is_uom } from "../uom/uom_extension";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

type LHS = Rat;
type RHS = Uom;
type EXP = BCons<Sym, LHS, RHS>;

class Op extends Function2<LHS, RHS> implements Operator<EXP> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('add_2_rat_uom', MATH_ADD, is_rat, is_uom, $);
        this.hash = hash_binop_atom_atom(MATH_ADD, HASH_RAT, HASH_UOM);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform2(opr: Sym, lhs: LHS, rhs: RHS): [TFLAGS, U] {
        // TODO: What if the Rat is zero?
        return [TFLAG_DIFF, new Err('operator + (Rat, Uom) is not supported.')];
    }
}

export const add_2_rat_uom = new Builder();
