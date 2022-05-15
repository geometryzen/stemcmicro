
import { CHANGED, ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { MATH_MUL } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { Blade } from "../../tree/vec/Blade";
import { is_blade } from "../blade/BladeExtension";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

/**
 * Blade * Blade
 */
class Op extends Function2<Blade, Blade> implements Operator<BCons<Sym, Blade, Blade>> {
    constructor($: ExtensionEnv) {
        super('mul_2_blade_blade', MATH_MUL, is_blade, is_blade, $);
    }
    transform2(opr: Sym, lhs: Blade, rhs: Blade): [TFLAGS, U] {
        return [CHANGED, lhs.mul(rhs)];
    }
}

export const mul_2_blade_blade = new Builder();
