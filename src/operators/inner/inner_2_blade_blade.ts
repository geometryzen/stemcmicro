
import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { hash_binop_atom_atom, HASH_BLADE } from "../../hashing/hash_info";
import { MATH_INNER } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { Blade } from "../../tree/vec/Blade";
import { is_blade } from "../blade/is_blade";
import { Function2 } from "../helpers/Function2";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

/**
 * Blade1 | Blade2 => Blade1.scp(Blade2)
 */
class Op extends Function2<Blade, Blade> implements Operator<Cons> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('inner_2_blade_blade', MATH_INNER, is_blade, is_blade, $);
        this.hash = hash_binop_atom_atom(MATH_INNER, HASH_BLADE, HASH_BLADE);
    }
    transform2(opr: Sym, lhs: Blade, rhs: Blade): [TFLAGS, U] {
        return [TFLAG_DIFF, this.$.valueOf(lhs.scp(rhs))];
    }
}

export const inner_2_blade_blade = new Builder();
