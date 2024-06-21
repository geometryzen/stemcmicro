import { HASH_ANY, hash_unaop_atom } from "@stemcmicro/hashing";
import { Native, native_sym } from "@stemcmicro/native";
import { EnvConfig } from "../../env/EnvConfig";
import { mkbuilder, TFLAGS, TFLAG_NONE } from "../../env/ExtensionEnv";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { Cons1 } from "../helpers/Cons1";
import { Function1 } from "../helpers/Function1";
import { is_any } from "../helpers/is_any";

export const RECT = native_sym(Native.rect);

type ARG = U;
type EXP = Cons1<Sym, ARG>;

class Op extends Function1<ARG> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super("rect_any", RECT, is_any);
        this.#hash = hash_unaop_atom(RECT, HASH_ANY);
    }
    get hash(): string {
        return this.#hash;
    }
    transform1(opr: Sym, arg: ARG, rectExpr: EXP): [TFLAGS, U] {
        // console.lg(this.name, this.$.toInfixString(rectExpr));
        return [TFLAG_NONE, rectExpr];
    }
}

export const rect_any = mkbuilder(Op);
