import { Blade, is_blade } from "@stemcmicro/atoms";
import { EnvConfig } from "../../env/EnvConfig";
import { Extension, ExtensionBuilder, ExtensionEnv, TFLAGS } from "../../env/ExtensionEnv";
import { HASH_BLADE, hash_unaop_atom } from "../../hashing/hash_info";
import { Native } from "@stemcmicro/native";
import { native_sym } from "@stemcmicro/native";
import { Sym } from "../../tree/sym/Sym";
import { items_to_cons, U } from "../../tree/tree";
import { Cons1 } from "../helpers/Cons1";
import { Function1 } from "../helpers/Function1";
import { GUARD } from "../helpers/GUARD";
import { wrap_as_transform } from "../wrap_as_transform";

export const MATH_SQRT = native_sym(Native.sqrt);

class Builder implements ExtensionBuilder<U> {
    create(config: Readonly<EnvConfig>): Extension<U> {
        return new Op(config);
    }
}

export abstract class Function1Atom<T extends U> extends Function1<T> {
    readonly #hash: string;
    constructor(
        opr: Sym,
        guard: GUARD<U, T>,
        hash: string,
        readonly config: Readonly<EnvConfig>
    ) {
        super(`${opr.key()}_${hash}`, opr, guard);
        this.#hash = hash_unaop_atom(this.opr, hash);
    }
    get hash(): string {
        return this.#hash;
    }
}

export abstract class FunctionBlade extends Function1Atom<Blade> {
    constructor(
        opr: Sym,
        readonly config: Readonly<EnvConfig>
    ) {
        super(opr, is_blade, HASH_BLADE, config);
    }
}

class Op extends FunctionBlade {
    constructor(config: Readonly<EnvConfig>) {
        super(native_sym(Native.abs), config);
    }
    transform1(opr: Sym, arg: Blade, expr: Cons1<Sym, Blade>, $: ExtensionEnv): [TFLAGS, U] {
        const innerProduct = arg.scp(arg);
        const retval = $.valueOf(items_to_cons(MATH_SQRT, $.valueOf(innerProduct)));
        return wrap_as_transform(retval, expr);
    }
}

export const abs_blade = new Builder();
