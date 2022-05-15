
import { CHANGED, ExtensionEnv, NOFLAGS, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { MATH_ADD } from "../../runtime/ns_math";
import { is_rat } from "../../tree/rat/is_rat";
import { Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { is_sym } from "../sym/is_sym";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

/**
 * Rat(0) + Sym => Sym
 */
class Op extends Function2<Rat, Sym> implements Operator<Cons> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('add_2_rat_sym', MATH_ADD, is_rat, is_sym, $);
        this.hash = '(+ Rat Sym)';
    }
    transform2(opr: Sym, lhs: Rat, rhs: Sym, orig: BCons<Sym, Rat, Sym>): [TFLAGS, U] {
        if (lhs.isZero()) {
            return [CHANGED, rhs];
        }
        return [NOFLAGS, orig];
    }
}

export const add_2_rat_sym = new Builder();
