import { Native, native_sym } from "math-expression-native";
import { Cons } from "math-expression-tree";
import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder } from "../../env/ExtensionEnv";
import { CompositePredicate } from "../helpers/CompositePredicate";

const ADD = native_sym(Native.add);
const IS_REAL = native_sym(Native.isreal);

class Op extends CompositePredicate {
    constructor(readonly config: Readonly<EnvConfig>) {
        super(IS_REAL, ADD, config);
    }
    compute(inner: Cons, $: ExtensionEnv): boolean {
        return [...inner.argList].every(function (arg) {
            return $.isreal(arg);
        });
    }
}

export const is_real_add = mkbuilder(Op);
