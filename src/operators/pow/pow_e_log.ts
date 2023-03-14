import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_binop_atom_atom, HASH_SYM } from "../../hashing/hash_info";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { is_base_of_natural_logarithm } from "../../predicates/is_base_of_natural_logarithm";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, U } from "../../tree/tree";
import { BCons } from "../helpers/BCons";
import { Function2X } from "../helpers/Function2X";
import { is_sym } from "../sym/is_sym";

const LOG = native_sym(Native.log);
const POW = native_sym(Native.pow);

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

function cross(base: Sym, expo: U): boolean {
    if (is_base_of_natural_logarithm(base)) {
        if (is_cons(expo)) {
            const opr = expo.head;
            return is_sym(opr) && opr.equalsSym(LOG);
        }
        else {
            return false;
        }
    }
    else {
        return false;
    }
}

type LHS = Sym;
type RHS = Cons;
type EXP = BCons<Sym, LHS, RHS>;

/**
 * exp(log(x)) => x
 */
class Op extends Function2X<LHS, RHS> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('pow_2_e_log', POW, is_sym, is_cons, cross, $);
        this.hash = hash_binop_atom_atom(this.opr, HASH_SYM, HASH_ANY);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform2(opr: Sym, base: LHS, expo: RHS, expr: EXP): [TFLAGS, U] {
        const x = expo.argList.head;
        return [TFLAG_DIFF, x];
    }
}

export const pow_e_log = new Builder();

