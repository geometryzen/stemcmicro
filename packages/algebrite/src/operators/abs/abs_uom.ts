import { Uom } from "@stemcmicro/atoms";
import { EnvConfig } from "../../env/EnvConfig";
import { Extension, ExtensionBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { hash_for_atom, hash_unaop_atom } from "@stemcmicro/hashing";
import { Native } from "@stemcmicro/native";
import { native_sym } from "@stemcmicro/native";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { Cons1 } from "../helpers/Cons1";
import { Function1 } from "../helpers/Function1";
import { GUARD } from "../helpers/GUARD";
import { is_uom } from "../uom/is_uom";
import { create_uom } from "../uom/uom";
import { wrap_as_transform } from "../wrap_as_transform";

const HASH_UOM = hash_for_atom(create_uom("kilogram"));

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
        super(`${opr.key()}_${HASH_UOM}`, opr, guard);
        this.#hash = hash_unaop_atom(this.opr, HASH_UOM);
    }
    get hash(): string {
        return this.#hash;
    }
}

export abstract class FunctionUom extends Function1Atom<Uom> {
    constructor(
        opr: Sym,
        readonly config: Readonly<EnvConfig>
    ) {
        super(opr, is_uom, HASH_UOM, config);
    }
}

class Op extends FunctionUom {
    constructor(readonly config: Readonly<EnvConfig>) {
        super(native_sym(Native.abs), config);
    }
    transform1(opr: Sym, arg: Uom, expr: Cons1<Sym, Uom>): [TFLAGS, U] {
        return wrap_as_transform(arg, expr);
    }
}

export const abs_uom = new Builder();
