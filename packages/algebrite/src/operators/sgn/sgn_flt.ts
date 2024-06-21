import { Flt, is_flt, negOne, one, Rat, Sym, zero } from "@stemcmicro/atoms";
import { HASH_FLT, hash_unaop_atom } from "@stemcmicro/hashing";
import { U } from "@stemcmicro/tree";
import { Extension, ExtensionBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { SGN } from "../../runtime/constants";
import { Function1 } from "../helpers/Function1";

class Builder implements ExtensionBuilder<U> {
    create(): Extension<U> {
        return new SgnFlt();
    }
}

class SgnFlt extends Function1<Flt> {
    readonly #hash: string;
    constructor() {
        super("sgn_flt", SGN, is_flt);
        this.#hash = hash_unaop_atom(this.opr, HASH_FLT);
    }
    get hash(): string {
        return this.#hash;
    }
    transform1(opr: Sym, arg: Flt): [TFLAGS, U] {
        return [TFLAG_DIFF, sgn_of_flt(arg)];
    }
}

export const sgn_flt_builder = new Builder();

// const not_is_flt = (expr: U) => !is_flt(expr);
/*
function sgn_extension_flt(expr: Cons, $: ExtensionEnv): U {
    const arg = $.valueOf(expr.argList.car);
    if (is_flt(arg)) {
        return sgn_of_flt(arg);
    }
    if (is_multiply(arg) && count_factors(arg, is_flt) === 1) {
        const rem = remove_factors(arg, is_flt);
        const rat = assert_flt(remove_factors(arg, not_is_flt));
        const srat = sgn_of_flt(rat);
        const srem = sgn(rem, $);
        return $.multiply(srat, srem);
    }
    return expr;
}
*/
function sgn_of_flt(arg: Flt): Rat {
    if (arg.d > 0) {
        return one;
    }
    if (arg.d === 0) {
        return zero;
    }
    return negOne;
}
/*
function assert_flt(expr: U): Flt {
    if (is_flt(expr)) {
        return expr;
    }
    else {
        throw new Error();
    }
}
*/
