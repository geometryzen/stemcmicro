import { Sym } from "@stemcmicro/atoms";
import { Cons1, U } from "@stemcmicro/tree";
import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, TFLAGS } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_unaop_atom } from "../../hashing/hash_info";
import { UNIT } from "../../runtime/constants";
import { Function1 } from "../helpers/Function1";
import { is_any } from "../helpers/is_any";
import { unit } from "./transform-unit";

type ARG = U;
type EXP = Cons1<Sym, ARG>;

class Op extends Function1<ARG> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super("unit", UNIT, is_any);
        this.#hash = hash_unaop_atom(this.opr, HASH_ANY);
    }
    get hash(): string {
        return this.#hash;
    }
    transform1(opr: Sym, arg: ARG, expr: EXP, $: ExtensionEnv): [TFLAGS, U] {
        return unit(arg, expr, $);
    }
}

export const unit_any = mkbuilder(Op);
