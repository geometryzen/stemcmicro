import { Blade, is_blade } from "math-expression-atoms";
import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { HASH_BLADE, hash_unaop_atom } from "../../hashing/hash_info";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { Sym } from "../../tree/sym/Sym";
import { items_to_cons, U } from "../../tree/tree";
import { Function1 } from "../helpers/Function1";
import { GUARD } from "../helpers/GUARD";
import { Cons1 } from "../helpers/Cons1";
import { wrap_as_transform } from "../wrap_as_transform";

export const MATH_SQRT = native_sym(Native.sqrt);

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

export abstract class Function1Atom<T extends U> extends Function1<T> {
    readonly #hash: string;
    constructor(opr: Sym, guard: GUARD<U, T>, hash: string, $: ExtensionEnv) {
        super(`${opr.key()}_${hash}`, opr, guard, $);
        this.#hash = hash_unaop_atom(this.opr, hash);
    }
    get hash(): string {
        return this.#hash;
    }
}

export abstract class FunctionBlade extends Function1Atom<Blade> {
    constructor(opr: Sym, $: ExtensionEnv) {
        super(opr, is_blade, HASH_BLADE, $);
    }
}

class Op extends FunctionBlade {
    constructor($: ExtensionEnv) {
        super(native_sym(Native.abs), $);
    }
    transform1(opr: Sym, arg: Blade, expr: Cons1<Sym, Blade>): [TFLAGS, U] {
        const $ = this.$;
        const innerProduct = arg.scp(arg);
        const retval = $.valueOf(items_to_cons(MATH_SQRT, $.valueOf(innerProduct)));
        return wrap_as_transform(retval, expr);
    }
}

export const abs_blade = new Builder();
