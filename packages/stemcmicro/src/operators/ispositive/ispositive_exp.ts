import { Native, native_sym } from "@stemcmicro/native";
import { U } from "@stemcmicro/tree";
import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder } from "../../env/ExtensionEnv";
import { CompositePredicate } from "../helpers/CompositePredicate";

const EXP = native_sym(Native.exp);
const ISPOS = native_sym(Native.ispositive);

class Op extends CompositePredicate {
    constructor(readonly config: Readonly<EnvConfig>) {
        super(ISPOS, EXP, config);
    }
    compute(arg: U, $: ExtensionEnv): boolean {
        return $.isreal(arg);
    }
}

export const ispositive_exp = mkbuilder(Op);
