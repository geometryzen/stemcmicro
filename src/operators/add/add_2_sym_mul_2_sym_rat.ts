import { CHANGED, ExtensionEnv, NOFLAGS, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { makeList } from "../../makeList";
import { MATH_ADD } from "../../runtime/ns_math";
import { Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { BCons } from "../helpers/BCons";
import { binswap } from "../helpers/binswap";
import { Function2 } from "../helpers/Function2";
import { is_mul_2_sym_rat } from "../mul/is_mul_2_sym_rat";
import { is_sym } from "../sym/is_sym";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

//
// TODO: This could be add_2_any_any, with the flip being done by mul_2_rat_sym
//
// a + (Sym * Rat) => a + (Rat * Sym)
//
class Op extends Function2<Sym, BCons<Sym, Sym, Rat>> implements Operator<Cons> {
    constructor($: ExtensionEnv) {
        super('add_2_sym_mul_2_sym_rat', MATH_ADD, is_sym, and(is_cons, is_mul_2_sym_rat), $);
    }
    transform2(opr: Sym, lhs: Sym, rhs: BCons<Sym, Sym, Rat>, orig: BCons<Sym, Sym, BCons<Sym, Sym, Rat>>): [TFLAGS, U] {
        const $ = this.$;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const hook = function (retval: U, description: string): U {
            // console.lg(`${expr} => ${retval} @ add_2_sym_mul_2_sym_rat ${description}`);
            return retval;
        };
        if ($.explicateMode) {
            const retval = makeList(opr, lhs, binswap(rhs));
            return [CHANGED, hook(retval, "A")];
        }
        return [NOFLAGS, hook(orig, "B")];
    }
}

export const add_2_sym_mul_2_sym_rat = new Builder();
