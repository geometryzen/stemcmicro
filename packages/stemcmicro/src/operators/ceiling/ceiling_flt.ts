import { create_flt, create_sym, Flt, is_flt, Sym } from "@stemcmicro/atoms";
import { U } from "@stemcmicro/tree";
import { EnvConfig } from "../../env/EnvConfig";
import { mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { Function1 } from "../helpers/Function1";

class CeilingFlt extends Function1<Flt> {
    constructor(readonly config: Readonly<EnvConfig>) {
        super("ceiling_flt", create_sym("ceiling"), is_flt);
    }
    transform1(opr: Sym, arg: Flt): [TFLAGS, U] {
        return [TFLAG_DIFF, create_flt(Math.ceil(arg.d))];
    }
}

export const ceiling_flt = mkbuilder(CeilingFlt);
