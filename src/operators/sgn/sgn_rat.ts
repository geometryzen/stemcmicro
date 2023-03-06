import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { HASH_RAT, hash_unaop_atom } from "../../hashing/hash_info";
import { mmul } from "../../mmul";
import { SGN } from "../../runtime/constants";
import { negOne, one, Rat, zero } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { Function1 } from "../helpers/Function1";
import { is_rat } from "../rat/is_rat";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new SgnRat($);
    }
}

class SgnRat extends Function1<Rat> implements Operator<U> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('sgn_rat', SGN, is_rat, $);
        this.hash = hash_unaop_atom(this.opr, HASH_RAT);
    }
    transform1(opr: Sym, arg: Rat): [TFLAGS, U] {
        return [TFLAG_DIFF, sgn_of_rat(arg)];
    }
}

export const sgn_rat = new Builder();

// const not_is_rat = (expr: U) => !is_rat(expr);
/*
export function sgn_extension_rat(expr: Cons, $: ExtensionEnv): U {
    const arg = $.valueOf(expr.argList.car);
    if (is_rat(arg)) {
        return sgn_of_rat(arg);
    }
    if (is_multiply(arg) && count_factors(arg, is_rat) === 1) {
        const rem = remove_factors(arg, is_rat);
        const rat = assert_rat(remove_factors(arg, not_is_rat));
        const srat = sgn_of_rat(rat);
        const srem = sgn(rem, $);
        return $.multiply(srat, srem);
    }
    return expr;
}
*/

function sgn_of_rat(arg: Rat): Rat {
    const ab = mmul(arg.a, arg.b);
    if (ab.isNegative()) {
        return negOne;
    }
    if (ab.isZero()) {
        return zero;
    }
    return one;
}
/*
function assert_rat(expr: U): Rat {
    if (is_rat(expr)) {
        return expr;
    }
    else {
        throw new Error();
    }
}
*/
