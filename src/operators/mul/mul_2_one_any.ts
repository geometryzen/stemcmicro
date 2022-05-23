
import { TFLAG_DIFF, ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_binop_atom_atom, HASH_RAT } from "../../hashing/hash_info";
import { is_num } from "../../predicates/is_num";
import { MATH_MUL } from "../../runtime/ns_math";
import { Num } from "../../tree/num/Num";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { BCons } from "../helpers/BCons";
import { Function2X } from "../helpers/Function2X";
import { is_any } from "../helpers/is_any";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function cross(lhs: Num, rhs: U): boolean {
    return lhs.isOne();
}

// TODO: Perhaps any is not sensible.
// e.g. 1 * string or Identity Matrix * Rat.

//
// 1 * x => x
//
class Op extends Function2X<Num, U> implements Operator<BCons<Sym, Num, U>> {
    readonly breaker = true;
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('mul_2_one_any', MATH_MUL, is_num, is_any, cross, $);
        // Notice that hashing does not (yet at least) support the concept of Num.
        this.hash = hash_binop_atom_atom(MATH_MUL, HASH_RAT, HASH_ANY);
    }
    transform2(opr: Sym, lhs: Num, rhs: U): [TFLAGS, U] {
        return [TFLAG_DIFF, rhs];
    }
}

export const mul_2_one_any = new Builder();
