
import { CHANGED, ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { MATH_RCO } from "../../runtime/ns_math";
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
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('rco_2_blade_blade', MATH_RCO, is_blade, is_blade, $);
        this.hash = `(>> Blade Blade)`;
    }
    transform2(opr: Sym, lhs: Blade, rhs: Blade): [TFLAGS, U] {
        return [CHANGED, lhs.__rshift__(rhs)];
    }
}

export const rco_2_blade_blade = new Builder();
