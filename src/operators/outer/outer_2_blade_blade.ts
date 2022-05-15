
import { CHANGED, ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { MATH_OUTER } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { Blade } from "../../tree/vec/Blade";
import { is_blade } from "../blade/BladeExtension";
import { Function2 } from "../helpers/Function2";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

class Op extends Function2<Blade, Blade> implements Operator<Cons> {
    readonly breaker = true;
    constructor($: ExtensionEnv) {
        super('outer_2_blade_blade', MATH_OUTER, is_blade, is_blade, $);
    }
    transform2(opr: Sym, lhs: Blade, rhs: Blade): [TFLAGS, U] {
        return [CHANGED, lhs.__wedge__(rhs)];
    }
}

export const outer_2_blade_blade = new Builder();
