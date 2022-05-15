import { CHANGED, ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { is_num } from "../../predicates/is_num";
import { MATH_ADD } from "../../runtime/ns_math";
import { Err } from "../../tree/err/Err";
import { Num } from "../../tree/num/Num";
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

type LHS = Num;
type RHS = Uom;
type EXPR = BCons<Sym, LHS, RHS>;

class Op extends Function2<LHS, RHS> implements Operator<EXPR> {
    constructor($: ExtensionEnv) {
        super('add_2_num_uom', MATH_ADD, is_num, is_uom, $);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform2(opr: Sym, lhs: LHS, rhs: RHS): [TFLAGS, U] {
        return [CHANGED, new Err('operator + (Num, Uom) is not supported.')];
    }
}

export const add_2_num_uom = new Builder();
