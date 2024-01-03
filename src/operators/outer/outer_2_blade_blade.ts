
import { Blade, is_blade } from "math-expression-atoms";
import { ExtensionEnv, FEATURE, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { hash_binop_atom_atom, HASH_BLADE } from "../../hashing/hash_info";
import { MATH_OUTER } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { Function2 } from "../helpers/Function2";

class OuterBladeBladeBuilder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new OuterBladeBlade($);
    }
}

/**
 * Blade ^ Blade
 */
class OuterBladeBlade extends Function2<Blade, Blade> implements Operator<Cons> {
    readonly hash: string;
    readonly dependencies: FEATURE[] = ['Blade'];
    constructor($: ExtensionEnv) {
        super('outer_2_blade_blade', MATH_OUTER, is_blade, is_blade, $);
        this.hash = hash_binop_atom_atom(MATH_OUTER, HASH_BLADE, HASH_BLADE);
    }
    transform2(opr: Sym, lhs: Blade, rhs: Blade): [TFLAGS, U] {
        return [TFLAG_DIFF, lhs.wedge(rhs)];
    }
}

export const outer_2_blade_blade = new OuterBladeBladeBuilder();
