import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { HASH_BLADE, hash_unaop_atom } from "../../hashing/hash_info";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { Sym } from "../../tree/sym/Sym";
import { items_to_cons, U } from "../../tree/tree";
import { Blade } from "../../tree/vec/Blade";
import { is_blade } from "../blade/is_blade";
import { Function1 } from "../helpers/Function1";
import { GUARD } from "../helpers/GUARD";
import { UCons } from "../helpers/UCons";
import { wrap_as_transform } from "../wrap_as_transform";

export const MATH_SQRT = native_sym(Native.sqrt);

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

export abstract class Function1Atom<T extends U> extends Function1<T> {
    readonly hash: string;
    constructor(opr: Sym, guard: GUARD<U, T>, hash: string, $: ExtensionEnv) {
        super(`${opr.text}_${hash}`, opr, guard, $);
        this.hash = hash_unaop_atom(this.opr, hash);
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
    transform1(opr: Sym, arg: Blade, expr: UCons<Sym, Blade>): [TFLAGS, U] {
        const $ = this.$;
        const innerProduct = arg.scp(arg);
        const retval = $.valueOf(items_to_cons(MATH_SQRT, $.valueOf(innerProduct)));
        return wrap_as_transform(retval, expr);
    }
}

export const abs_blade = new Builder();
