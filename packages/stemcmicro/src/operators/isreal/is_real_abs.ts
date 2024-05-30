import { Native, native_sym } from "@stemcmicro/native";
import { EnvConfig } from "../../env/EnvConfig";
import { mkbuilder } from "../../env/ExtensionEnv";
import { CompositePredicate } from "../helpers/CompositePredicate";

const ABS = native_sym(Native.abs);
const ISREAL = native_sym(Native.isreal);

class IsRealAdd extends CompositePredicate {
    constructor(readonly config: Readonly<EnvConfig>) {
        super(ISREAL, ABS, config);
    }
    compute(): boolean {
        return true;
    }
}

export const is_real_abs = mkbuilder(IsRealAdd);
