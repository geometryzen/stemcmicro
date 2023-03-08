import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { hash_unaop_atom, HASH_UOM } from "../../hashing/hash_info";
import { create_sym, Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { Uom } from "../../tree/uom/Uom";
import { Function1 } from "../helpers/Function1";
import { GUARD } from "../helpers/GUARD";
import { UCons } from "../helpers/UCons";
import { is_uom } from "../uom/is_uom";
import { wrap_as_transform } from "../wrap_as_transform";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

export abstract class Function1Atom<T extends U> extends Function1<T> {
    readonly hash: string;
    constructor(opr: Sym, guard: GUARD<U, T>, hash: string, $: ExtensionEnv) {
        super(`${opr.text}_${HASH_UOM}`, opr, guard, $);
        this.hash = hash_unaop_atom(this.opr, HASH_UOM);
    }
}

export abstract class FunctionUom extends Function1Atom<Uom> {
    constructor(opr: Sym, $: ExtensionEnv) {
        super(opr, is_uom, HASH_UOM, $);
    }
}

class Op extends FunctionUom {
    constructor($: ExtensionEnv) {
        super(create_sym('abs'), $);
    }
    transform1(opr: Sym, arg: Uom, expr: UCons<Sym, Uom>): [TFLAGS, U] {
        return wrap_as_transform(arg, expr);
    }
}

export const abs_uom = new Builder();
