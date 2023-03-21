import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF, TFLAG_HALT, TFLAG_NONE } from "../../env/ExtensionEnv";
import { hash_binop_atom_atom, HASH_RAT, HASH_SYM } from "../../hashing/hash_info";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { one, Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { is_rat } from "../rat/is_rat";
import { is_sym } from "../sym/is_sym";

const POW = native_sym(Native.pow);

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

type LHS = Rat;
type RHS = Sym;
type EXP = BCons<Sym, LHS, RHS>;

class Op extends Function2<LHS, RHS> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('pow_rat_sym', POW, is_rat, is_sym, $);
        this.hash = hash_binop_atom_atom(POW, HASH_RAT, HASH_SYM);
    }
    transform2(opr: Sym, base: LHS, expo: RHS, expr: EXP): [TFLAGS, U] {
        const $ = this.$;
        if (base.isOne()) {
            if ($.isreal(expo)) {
                return [TFLAG_DIFF, one];
            }
            else {
                return [TFLAG_HALT, expr];
            }
        }
        else {
            return [TFLAG_NONE, expr];
        }
    }
}

export const pow_rat_sym = new Builder();
