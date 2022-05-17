import { CHANGED, ExtensionEnv, FEATURE, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { hash_binop_atom_atom, HASH_FLT, HASH_UOM } from "../../hashing/hash_info";
import { MATH_ADD } from "../../runtime/ns_math";
import { Err } from "../../tree/err/Err";
import { Flt } from "../../tree/flt/Flt";
import { is_flt } from "../../tree/flt/is_flt";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { Uom } from "../../tree/uom/Uom";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { is_uom } from "../uom/UomExtension";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

type LHS = Uom;
type RHS = Flt;
type EXP = BCons<Sym, LHS, RHS>;

class Op extends Function2<LHS, RHS> implements Operator<EXP> {
    readonly hash: string;
    readonly dependencies: FEATURE[] = ['Flt', 'Uom'];
    constructor($: ExtensionEnv) {
        super('add_2_uom_flt', MATH_ADD, is_uom, is_flt, $);
        this.hash = hash_binop_atom_atom(MATH_ADD, HASH_UOM, HASH_FLT);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform2(opr: Sym, lhs: LHS, rhs: RHS): [TFLAGS, U] {
        return [CHANGED, new Err(`operator + (Uom, Flt) is not supported.`)];
    }
}

export const add_2_uom_flt = new Builder();
