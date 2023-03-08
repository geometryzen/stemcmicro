import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { HASH_BLADE, hash_unaop_atom } from "../../hashing/hash_info";
import { create_sym, Sym } from "../../tree/sym/Sym";
import { items_to_cons, U } from "../../tree/tree";
import { Blade } from "../../tree/vec/Blade";
import { is_blade } from "../blade/is_blade";
import { Function1 } from "../helpers/Function1";
import { GUARD } from "../helpers/GUARD";
import { UCons } from "../helpers/UCons";
import { MATH_SQRT } from "../sqrt/MATH_SQRT";
import { wrap_as_transform } from "../wrap_as_transform";

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
        super(create_sym('abs'), $);
    }
    transform1(opr: Sym, arg: Blade, expr: UCons<Sym, Blade>): [TFLAGS, U] {
        const $ = this.$;
        const innerProduct = arg.__vbar__(arg);
        const retval = $.valueOf(items_to_cons(MATH_SQRT, $.valueOf(innerProduct)));
        return wrap_as_transform(retval, expr);
    }
}

export const abs_blade = new Builder();
