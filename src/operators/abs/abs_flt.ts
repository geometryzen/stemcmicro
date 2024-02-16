import { EnvConfig } from "../../env/EnvConfig";
import { mkbuilder, TFLAGS } from "../../env/ExtensionEnv";
import { HASH_FLT, hash_unaop_atom } from "../../hashing/hash_info";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { Flt } from "../../tree/flt/Flt";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { is_flt } from "../flt/is_flt";
import { Cons1 } from "../helpers/Cons1";
import { Function1 } from "../helpers/Function1";
import { wrap_as_transform } from "../wrap_as_transform";

class Op extends Function1<Flt> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super('abs_flt', native_sym(Native.abs), is_flt);
        this.#hash = hash_unaop_atom(this.opr, HASH_FLT);
    }
    get hash(): string {
        return this.#hash;
    }
    transform1(opr: Sym, arg: Flt, expr: Cons1<Sym, Flt>): [TFLAGS, U] {
        return wrap_as_transform(arg.abs(), expr);
    }
}

export const abs_flt = mkbuilder(Op);
